import { requestWithAuth } from '@/shared/api';

export const updateLastUsedLanguage = async (lastUsedLanguageId: number): Promise<void> => {
  await requestWithAuth({
    path: '/api/user',
    method: 'PATCH',
    body: { lastUsedLanguageId },
  });
};
