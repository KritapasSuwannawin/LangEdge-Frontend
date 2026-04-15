import zod from 'zod';

import { ApiInvalidResponseError, ApiRateLimitError, ApiResponseError, ApiUnauthorizedError, requestWithAuth } from '@/shared/api';

const exampleSentenceSchema = zod.object({
  sentence: zod.string(),
  translation: zod.string(),
});

export const translationResponseSchema = zod.object({
  originalLanguageName: zod.string(),
  inputTextSynonymArr: zod.array(zod.string()).optional(),
  translation: zod.string(),
  translationSynonymArr: zod.array(zod.string()).optional(),
  exampleSentenceArr: zod.array(exampleSentenceSchema).optional(),
});

const TRANSLATION_REQUEST_ERROR_CODES = ['invalidInput', 'unauthorized', 'rateLimited', 'unexpected'] as const;

export type TranslationRequestErrorCode = (typeof TRANSLATION_REQUEST_ERROR_CODES)[number];
export type TranslationResponse = zod.infer<typeof translationResponseSchema>;

export class TranslationRequestError extends Error {
  readonly code: TranslationRequestErrorCode;

  constructor(code: TranslationRequestErrorCode, message: string) {
    super(message);
    this.name = 'TranslationRequestError';
    this.code = code;
  }
}

export const isTranslationRequestErrorCode = (value: unknown): value is TranslationRequestErrorCode => {
  return typeof value === 'string' && TRANSLATION_REQUEST_ERROR_CODES.some((code) => code === value);
};

const toTranslationRequestError = (error: unknown): TranslationRequestError => {
  if (error instanceof TranslationRequestError) {
    return error;
  }

  if (error instanceof ApiUnauthorizedError) {
    return new TranslationRequestError('unauthorized', error.message);
  }

  if (error instanceof ApiRateLimitError) {
    return new TranslationRequestError('rateLimited', error.message);
  }

  if (error instanceof ApiResponseError && error.message === 'Invalid input') {
    return new TranslationRequestError('invalidInput', error.message);
  }

  if (error instanceof Error) {
    return new TranslationRequestError('unexpected', error.message);
  }

  return new TranslationRequestError('unexpected', 'Translation request failed');
};

export async function requestTranslation(params: { inputText: string; outputLanguageId: number }): Promise<TranslationResponse> {
  const query = new URLSearchParams({
    text: params.inputText,
    outputLanguageId: params.outputLanguageId.toString(),
  });

  try {
    const response = await requestWithAuth<unknown>({
      path: `/api/translation?${query.toString()}`,
    });

    const parsedResult = translationResponseSchema.safeParse(response.data);

    if (!parsedResult.success) {
      throw new ApiInvalidResponseError('Invalid data format', response.status, response.data);
    }

    return parsedResult.data;
  } catch (error) {
    throw toTranslationRequestError(error);
  }
}
