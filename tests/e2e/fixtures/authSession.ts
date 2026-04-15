import type { Page } from '@playwright/test';

import type { AuthTokens } from './testData';

const E2E_AUTH_STORAGE_KEY = 'langedge:e2e-auth-tokens';

export const seedStoredTokensOnNextLoad = async (page: Page, tokens: AuthTokens): Promise<void> => {
  await page.addInitScript((nextTokens) => {
    window.sessionStorage.setItem('accessToken', nextTokens.accessToken);
    window.sessionStorage.setItem('refreshToken', nextTokens.refreshToken);
  }, tokens);
};

export const setManualSignInTokens = async (page: Page, tokens: AuthTokens): Promise<void> => {
  await page.evaluate(
    ({ key, nextTokens }) => {
      window.sessionStorage.setItem(key, JSON.stringify(nextTokens));
    },
    { key: E2E_AUTH_STORAGE_KEY, nextTokens: tokens },
  );
};
