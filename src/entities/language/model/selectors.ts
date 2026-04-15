import { createSelector } from '@reduxjs/toolkit';

import type { Language } from './language';
import type { LanguageState } from './languageSlice';

export interface LanguageRootState {
  readonly language: LanguageState;
}

const selectLanguageState = (state: LanguageRootState): LanguageState => state.language;

export const selectLanguageArr = (state: LanguageRootState): Language[] | undefined => selectLanguageState(state).languageArr;
export const selectOutputLanguage = (state: LanguageRootState): Language | undefined => selectLanguageState(state).outputLanguage;
export const selectOutputLanguageId = createSelector(selectOutputLanguage, (outputLanguage) => outputLanguage?.id);
export const selectIsLanguageReady = createSelector(selectLanguageArr, selectOutputLanguage, (languageArr, outputLanguage): boolean =>
  Boolean(languageArr && languageArr.length > 0 && outputLanguage),
);
