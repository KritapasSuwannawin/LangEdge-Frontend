import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const translationSlice = createSlice({
  name: 'translation',
  initialState: {
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
      }>,
    ) => {
      state.translationOutput = action.payload;
    },
    clearTranslationOutput: (state) => {
      state.translationOutput = undefined;
    },
  },
});

export default translationSlice;
