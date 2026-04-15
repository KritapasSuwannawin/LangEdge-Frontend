import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { logErrorWithToast, toastInfo } from '@/shared/lib';

import type { TranslationRequestErrorCode } from '@/entities/translation/api/translationApi';
import { isTranslationRequestErrorCode } from '@/entities/translation/api/translationApi';

import { selectIsTranslating, selectLastTranslationCache } from './selectors';
import { requestTranslationThunk } from './thunks';
import { translationActions } from './translationSlice';
import type { LastTranslationCacheEntry, SubmitTranslationParams, TranslationOutput } from './types';

const TRANSLATION_ERROR_MESSAGES: Record<TranslationRequestErrorCode, string | null> = {
  invalidInput: 'The input text is invalid',
  unauthorized: 'Your session has expired, please sign in again.',
  rateLimited: 'You have reached the limit, please try again later.',
  unexpected: null,
};

const toTranslationOutput = (cacheEntry: LastTranslationCacheEntry): TranslationOutput => {
  return {
    originalLanguageName: cacheEntry.originalLanguageName,
    inputTextSynonymArr: cacheEntry.inputTextSynonymArr,
    translation: cacheEntry.translation,
    translationSynonymArr: cacheEntry.translationSynonymArr,
    exampleSentenceArr: cacheEntry.exampleSentenceArr,
  };
};

export type SubmitTranslation = (params: SubmitTranslationParams) => Promise<TranslationOutput | undefined>;

export const useSubmitTranslation = (): SubmitTranslation => {
  const dispatch = useAppDispatch();
  const isTranslating = useAppSelector(selectIsTranslating);
  const lastTranslationCache = useAppSelector(selectLastTranslationCache);

  return useCallback(
    async (params: SubmitTranslationParams): Promise<TranslationOutput | undefined> => {
      const trimmedInputText = params.inputText.trim();

      if (isTranslating) {
        return undefined;
      }

      dispatch(translationActions.setInputText(trimmedInputText));

      if (!trimmedInputText) {
        return undefined;
      }

      if (
        lastTranslationCache &&
        lastTranslationCache.inputText === trimmedInputText &&
        lastTranslationCache.outputLanguageId === params.outputLanguageId
      ) {
        const cachedTranslationOutput = toTranslationOutput(lastTranslationCache);

        dispatch(translationActions.setTranslationOutput(cachedTranslationOutput));

        return cachedTranslationOutput;
      }

      dispatch(translationActions.clearTranslationOutput());

      try {
        const translationOutput = await dispatch(
          requestTranslationThunk({
            inputText: trimmedInputText,
            outputLanguageId: params.outputLanguageId,
          }),
        ).unwrap();

        if (translationOutput.originalLanguageName.toLowerCase() === params.outputLanguageName.toLowerCase()) {
          toastInfo(`The input text is already in ${params.outputLanguageName}`);
        }

        return translationOutput;
      } catch (error: unknown) {
        const toastMessage = isTranslationRequestErrorCode(error) ? TRANSLATION_ERROR_MESSAGES[error] : undefined;

        logErrorWithToast('translate.request', error, { toastMessage });

        return undefined;
      }
    },
    [dispatch, isTranslating, lastTranslationCache],
  );
};
