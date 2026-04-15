import { createAsyncThunk } from '@reduxjs/toolkit';

import { getLanguageList } from '@/entities/language/api/languageApi';

import type { Language } from './language';
import { languageActions } from './languageSlice';
import type { LanguageState } from './languageSlice';

const DEFAULT_OUTPUT_LANGUAGE_NAME = 'English';

interface LanguageThunkState {
  readonly language: LanguageState;
}

const getDefaultOutputLanguage = (languageArr: ReadonlyArray<Language>, lastUsedLanguageId?: number): Language => {
  const outputLanguage = languageArr.find((language) =>
    lastUsedLanguageId ? language.id === lastUsedLanguageId : language.name === DEFAULT_OUTPUT_LANGUAGE_NAME,
  );

  return outputLanguage ?? languageArr[1] ?? languageArr[0];
};

export const loadLanguagesThunk = createAsyncThunk<void, number | undefined, { state: LanguageThunkState }>(
  'language/loadLanguages',
  async (lastUsedLanguageId, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    let languageArr = getState().language.languageArr;

    if (!languageArr || languageArr.length === 0) {
      languageArr = await getLanguageList();
      dispatch(languageActions.setLanguageArr(languageArr));
    }

    dispatch(languageActions.setOutputLanguage(getDefaultOutputLanguage(languageArr, lastUsedLanguageId)));
  },
);
