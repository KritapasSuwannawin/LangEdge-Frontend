import { createAsyncThunk } from '@reduxjs/toolkit';

import { eraseToken, sessionExpired } from '@/shared/lib';

import { requestTranslation, TranslationRequestError, type TranslationRequestErrorCode } from '@/entities/translation/api/translationApi';

import { normalizeTranslationResponse } from './normalizeTranslationResponse';
import type { TranslationRequestParams, TranslationOutput } from './types';

export const requestTranslationThunk = createAsyncThunk<
  TranslationOutput,
  TranslationRequestParams,
  { rejectValue: TranslationRequestErrorCode }
>('translation/requestTranslation', async (params, thunkApi) => {
  try {
    const translationResponse = await requestTranslation(params);

    return normalizeTranslationResponse(translationResponse);
  } catch (error) {
    if (error instanceof TranslationRequestError) {
      if (error.code === 'unauthorized') {
        eraseToken('accessToken');
        eraseToken('refreshToken');
        thunkApi.dispatch(sessionExpired());
      }

      return thunkApi.rejectWithValue(error.code);
    }

    throw error;
  }
});
