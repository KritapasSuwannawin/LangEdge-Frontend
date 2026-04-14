import zod from 'zod';

export interface UserSignInPayload {
  accessToken: string;
  refreshToken: string;
}

export interface UserSignInData {
  userId: string;
  email: string;
  name: string;
  pictureUrl?: string;
  lastUsedLanguageId?: number;
}

export const userSignInResponseSchema = zod.object({
  userId: zod.string(),
  email: zod.string(),
  name: zod.string(),
  pictureUrl: zod.string().optional(),
  lastUsedLanguageId: zod.number().int().positive().optional(),
});
