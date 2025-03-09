import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Language } from '../interfaces';

const translationSlice = createSlice({
  name: 'translation',
  initialState: {
    languageArr: undefined as Language[] | undefined,
    outputLanguage: undefined as Language | undefined,
    isTranslating: false,
    translationOutput: undefined as
      | {
          originalLanguageName: string;
          inputTextSynonymArr: string[];
          translation: string;
          translationSynonymArr: string[];
          exampleSentenceArr: { sentence: string; translation: string }[];
        }
      | undefined,
  },
  reducers: {
    setLanguageArr: (state, action: PayloadAction<Language[]>) => {
      state.languageArr = action.payload;
    },
    setOutputLanguage: (state, action: PayloadAction<Language>) => {
      state.outputLanguage = action.payload;
    },
    setIsTranslating: (state, action: PayloadAction<boolean>) => {
      state.isTranslating = action.payload;
    },
    setTranslationOutput: (
      state,
      action: PayloadAction<{
        originalLanguageName: string;
        inputTextSynonymArr: string[];
        translation: string;
        translationSynonymArr: string[];
        exampleSentenceArr: { sentence: string; translation: string }[];
      }>
    ) => {
      state.translationOutput = action.payload;
    },
    clearTranslationOutput: (state) => {
      state.translationOutput = undefined;
    },
  },
});

export default translationSlice;
