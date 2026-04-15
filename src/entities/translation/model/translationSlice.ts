import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { sessionExpired } from '@/shared/lib';

import { requestTranslationThunk } from '@/entities/translation/model/thunks';
import type { LastTranslationCacheEntry, TranslationOutput, TranslationState } from '@/entities/translation/model/types';

const initialState: TranslationState = {
  inputText: '',
  isTranslating: false,
  translationOutput: undefined,
  lastTranslationCache: undefined,
};

const clearTranslationState = (state: {
  inputText: string;
  isTranslating: boolean;
  translationOutput: TranslationOutput | undefined;
  lastTranslationCache: LastTranslationCacheEntry | undefined;
}): void => {
  state.inputText = '';
  state.isTranslating = false;
  state.translationOutput = undefined;
  state.lastTranslationCache = undefined;
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
    setTranslationOutput: (state, action: PayloadAction<TranslationOutput>) => {
      state.translationOutput = action.payload;
    },
    clearTranslationOutput: (state) => {
      state.translationOutput = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestTranslationThunk.pending, (state) => {
        state.isTranslating = true;
      })
      .addCase(requestTranslationThunk.fulfilled, (state, action) => {
        state.isTranslating = false;
        state.translationOutput = action.payload;
        state.lastTranslationCache = {
          inputText: action.meta.arg.inputText,
          outputLanguageId: action.meta.arg.outputLanguageId,
          ...action.payload,
        };
      })
      .addCase(requestTranslationThunk.rejected, (state) => {
        state.isTranslating = false;
      })
      .addCase(sessionExpired, clearTranslationState);
  },
});

export const translationReducer = translationSlice.reducer;
export const translationActions = translationSlice.actions;
