import { expect, test } from '@playwright/test';

import { createDeferred } from './fixtures/createDeferred';
import { seedStoredTokensOnNextLoad, setManualSignInTokens } from './fixtures/authSession';
import { createMockResponse, LangEdgeApiMock } from './fixtures/mockApi';
import { DEFAULT_AUTH_TOKENS, DEFAULT_LANGUAGES, MANUAL_SIGN_IN_USER, RESTORED_USER } from './fixtures/testData';
import { LangEdgePage } from './pages/LangEdgePage';

test.describe('Auth flows', () => {
  test('restores a stored session after bootstrap and language loading complete', async ({ page }) => {
    const app = new LangEdgePage(page);
    const api = new LangEdgeApiMock(page);
    const signInGate = createDeferred<void>();
    const languageGate = createDeferred<void>();

    await api.install();
    api.useSignInResponse(createMockResponse({ data: RESTORED_USER, gate: signInGate.promise }));
    api.useLanguageResponse(createMockResponse({ data: { languageArr: DEFAULT_LANGUAGES }, gate: languageGate.promise }));

    await seedStoredTokensOnNextLoad(page, DEFAULT_AUTH_TOKENS);
    await app.goto();

    await expect(app.appBootstrapSpinner).toBeVisible();

    signInGate.resolve();
    await expect(app.pageLoadingSpinner).toBeVisible();

    languageGate.resolve();
    await expect(app.profileToggle).toBeVisible();
    await expect(app.outputLanguageButton).toContainText('German');

    const signInRequests = api.getRequests('/api/user/sign-in', 'POST');

    expect(signInRequests).toHaveLength(1);
    expect(signInRequests[0]?.authorization).toBe(`Bearer ${DEFAULT_AUTH_TOKENS.accessToken}`);
  });

  test('signs in from the workspace CTA and signs out from the profile menu', async ({ page }) => {
    const app = new LangEdgePage(page);
    const api = new LangEdgeApiMock(page);

    await api.install();
    api.useSignInResponse(createMockResponse({ data: MANUAL_SIGN_IN_USER }));

    await app.goto();
    await expect(app.workspaceSignInButton).toBeVisible();

    await setManualSignInTokens(page, DEFAULT_AUTH_TOKENS);
    await app.signInFromWorkspace();

    await expect(app.translateSubmitButton).toBeVisible();
    await expect(app.profileToggle).toBeVisible();

    await app.fillInputText('gato');
    await app.openProfile();
    await expect(app.profileDetails).toBeVisible();

    await app.signOut();
    await expect(app.workspaceSignInButton).toBeVisible();
    await expect(app.inputTextarea).toHaveValue('');

    const signInRequests = api.getRequests('/api/user/sign-in', 'POST');

    expect(signInRequests).toHaveLength(1);
    expect(signInRequests[0]?.authorization).toBe(`Bearer ${DEFAULT_AUTH_TOKENS.accessToken}`);
    expect(await page.evaluate(() => window.sessionStorage.getItem('accessToken'))).toBeNull();
  });

  test('shows an auth error toast when navigation sign in fails', async ({ page }) => {
    const app = new LangEdgePage(page);
    const api = new LangEdgeApiMock(page);

    await api.install();
    api.useSignInResponse(createMockResponse({ status: 500, message: 'Unable to sign in' }));

    await app.goto();
    await setManualSignInTokens(page, DEFAULT_AUTH_TOKENS);
    await app.signInFromNavigation();

    await expect(app.getToast('Failed to sign in')).toBeVisible();
    await expect(app.navigationSignInButton).toBeVisible();
    await expect(app.profileToggle).toHaveCount(0);
  });
});
