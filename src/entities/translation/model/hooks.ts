import { useCallback } from 'react';

import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { requestTranslationThunk } from '@/entities/translation/model/thunks';
import { translationActions } from '@/entities/translation/model/translationSlice';
import type { TranslationOutput, TranslationRequestParams } from '@/entities/translation/model/types';

type TranslationDispatch = ThunkDispatch<unknown, unknown, UnknownAction>;

interface UseTranslationActionsResult {
  readonly clearTranslationOutput: () => void;
  readonly requestTranslation: (params: TranslationRequestParams) => Promise<TranslationOutput>;
  readonly setInputText: (inputText: string) => void;
  readonly setTranslationOutput: (translationOutput: TranslationOutput) => void;
}

export const useTranslationActions = (): UseTranslationActionsResult => {
  const dispatch = useDispatch<TranslationDispatch>();

  const clearTranslationOutput = useCallback((): void => {
    dispatch(translationActions.clearTranslationOutput());
  }, [dispatch]);

  const setInputText = useCallback(
    (inputText: string): void => {
      dispatch(translationActions.setInputText(inputText));
    },
    [dispatch],
  );

  const requestTranslation = useCallback(
    async (params: TranslationRequestParams): Promise<TranslationOutput> => {
      return await dispatch(requestTranslationThunk(params)).unwrap();
    },
    [dispatch],
  );

  const setTranslationOutput = useCallback(
    (translationOutput: TranslationOutput): void => {
      dispatch(translationActions.setTranslationOutput(translationOutput));
    },
    [dispatch],
  );

  return {
    clearTranslationOutput,
    requestTranslation,
    setInputText,
    setTranslationOutput,
  };
};
