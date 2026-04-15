import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Language } from './language';

export interface LanguageState {
  readonly languageArr: Language[] | undefined;
  readonly outputLanguage: Language | undefined;
}

const initialState: LanguageState = {
  languageArr: undefined,
  outputLanguage: undefined,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguageArr: (state, action: PayloadAction<Language[]>) => {
      state.languageArr = action.payload;
    },
    setOutputLanguage: (state, action: PayloadAction<Language>) => {
      state.outputLanguage = action.payload;
    },
  },
});

export const languageReducer = languageSlice.reducer;
export const languageActions = languageSlice.actions;
