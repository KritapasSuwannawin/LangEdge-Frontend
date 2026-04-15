import { expect, test, type Page } from '@playwright/test';

import { createDeferred } from './fixtures/createDeferred';
import { seedStoredTokensOnNextLoad } from './fixtures/authSession';
import { createMockResponse, LangEdgeApiMock, type RecordedRequest } from './fixtures/mockApi';
import {
  DEFAULT_AUTH_TOKENS,
  INITIAL_TRANSLATION,
  INPUT_SYNONYM_TRANSLATION,
  MANUAL_SIGN_IN_USER,
  MORE_TRANSLATION_RESULT,
} from './fixtures/testData';
import { LangEdgePage } from './pages/LangEdgePage';

const gotoAuthenticatedTranslatePage = async (page: Page, api: LangEdgeApiMock): Promise<LangEdgePage> => {
  const app = new LangEdgePage(page);

  await api.install();
  api.useSignInResponse(createMockResponse({ data: MANUAL_SIGN_IN_USER }));

  await seedStoredTokensOnNextLoad(page, DEFAULT_AUTH_TOKENS);
  await app.goto();
  await expect(app.translateSubmitButton).toBeVisible();

  return app;
};

const expectSingleRequest = (requests: RecordedRequest[]): RecordedRequest => {
  expect(requests).toHaveLength(1);

  return requests[0] as RecordedRequest;
};

test.describe('Translate flows', () => {
  test('covers the empty state and output language search, empty search, and persistence', async ({ page }) => {
    const api = new LangEdgeApiMock(page);
    const app = await gotoAuthenticatedTranslatePage(page, api);

    await expect(app.outputTextarea).toHaveValue('');
    await expect(app.getHeading('Synonyms')).toHaveCount(0);
    await expect(app.getHeading('More translations')).toHaveCount(0);
    await expect(app.getHeading('Example sentences')).toHaveCount(0);

    await app.openLanguageSelector();
    await app.searchLanguages('zzz');
    await expect(app.languageSelectorEmptyState).toBeVisible();

    await app.searchLanguages('ger');
    await app.selectLanguage(2);
    await expect(app.outputLanguageButton).toContainText('German');

    const updateRequest = expectSingleRequest(api.getRequests('/api/user', 'PATCH'));

    expect(updateRequest.body).toEqual({ lastUsedLanguageId: 2 });
  });

  test('covers translate loading, success, and synonym-driven follow-up requests', async ({ page }) => {
    const api = new LangEdgeApiMock(page);
    const app = await gotoAuthenticatedTranslatePage(page, api);
    const translationGate = createDeferred<void>();

    api.queueTranslationResponse(createMockResponse({ data: INITIAL_TRANSLATION, gate: translationGate.promise }));
    api.queueTranslationResponse(createMockResponse({ data: INPUT_SYNONYM_TRANSLATION }));
    api.queueTranslationResponse(createMockResponse({ data: MORE_TRANSLATION_RESULT }));

    await app.fillInputText('gato');
    await app.submitTranslation();
    await expect(app.translateSubmitButton).toHaveAttribute('aria-busy', 'true');

    translationGate.resolve();
    await expect(app.outputTextarea).toHaveValue('cat');
    await expect(app.getHeading('Synonyms')).toBeVisible();
    await expect(app.getHeading('More translations')).toBeVisible();
    await expect(app.getHeading('Example sentences')).toBeVisible();

    await app.clickInputSynonym(0);
    await expect(app.outputTextarea).toHaveValue('kitty');
    await expect(app.outputLanguageButton).toContainText('English');

    await app.clickTranslationSynonym(0);
    await expect(app.outputLanguageButton).toContainText('Spanish');
    await expect(app.outputTextarea).toHaveValue('felino');

    const translationRequests = api.getRequests('/api/translation', 'GET');

    expect(translationRequests).toHaveLength(3);
    expect(translationRequests[0]?.searchParams.get('text')).toBe('gato');
    expect(translationRequests[0]?.searchParams.get('outputLanguageId')).toBe('1');
    expect(translationRequests[1]?.searchParams.get('text')).toBe('kitty');
    expect(translationRequests[1]?.searchParams.get('outputLanguageId')).toBe('1');
    expect(translationRequests[2]?.searchParams.get('text')).toBe('young cat');
    expect(translationRequests[2]?.searchParams.get('outputLanguageId')).toBe('3');
  });

  test('shows a rate-limit error toast without leaving the empty result state', async ({ page }) => {
    const api = new LangEdgeApiMock(page);
    const app = await gotoAuthenticatedTranslatePage(page, api);

    api.queueTranslationResponse(createMockResponse({ status: 429, message: 'Too many requests' }));

    await app.fillInputText('gato');
    await app.submitTranslation();

    await expect(app.getToast('You have reached the limit, please try again later.')).toBeVisible();
    await expect(app.outputTextarea).toHaveValue('');
    await expect(app.getHeading('Synonyms')).toHaveCount(0);
    await expect(app.translateSubmitButton).toHaveAttribute('aria-busy', 'false');
  });
});
