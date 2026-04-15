import { useCallback, useEffect } from 'react';

import { useAppDispatch } from '@/app/store';
import { logErrorWithToast } from '@/shared/lib';

import type { Language } from './language';
import { languageActions } from './languageSlice';
import { loadLanguagesThunk } from './thunks';

interface UseLanguageActionsResult {
  readonly setOutputLanguage: (language: Language) => void;
}

export const useLanguageActions = (): UseLanguageActionsResult => {
  const dispatch = useAppDispatch();

  const setOutputLanguage = useCallback(
    (language: Language): void => {
      dispatch(languageActions.setOutputLanguage(language));
    },
    [dispatch],
  );

  return { setOutputLanguage };
};

export const useInitializeLanguages = (lastUsedLanguageId?: number): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadLanguagesThunk(lastUsedLanguageId))
      .unwrap()
      .catch((error: unknown) => {
        logErrorWithToast('translate.loadLanguages', error);
      });
  }, [dispatch, lastUsedLanguageId]);
};
