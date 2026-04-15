import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { sessionExpired } from '@/shared/lib';

import { requestTranslationThunk } from './thunks';
import type { TranslationOutput, TranslationState } from './types';

const initialState: TranslationState = {
  isTranslating: false,
  translationOutput: undefined,
};

const clearTranslationState = (state: { isTranslating: boolean; translationOutput: TranslationOutput | undefined }): void => {
  state.isTranslating = false;
  state.translationOutput = undefined;
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
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
      })
      .addCase(requestTranslationThunk.rejected, (state) => {
        state.isTranslating = false;
      })
      .addCase(sessionExpired, clearTranslationState);
  },
});

export const translationReducer = translationSlice.reducer;
export const translationActions = translationSlice.actions;
