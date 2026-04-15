import { createSelector } from '@reduxjs/toolkit';

import type { TranslationState, TranslationOutput, ExampleSentence } from './types';

export interface TranslationRootState {
  readonly translation: TranslationState;
}

const EMPTY_SYNONYMS: string[] = [];
const EMPTY_EXAMPLE_SENTENCES: ExampleSentence[] = [];

const selectTranslationState = (state: TranslationRootState): TranslationState => state.translation;

export const selectIsTranslating = (state: TranslationRootState): boolean => selectTranslationState(state).isTranslating;
export const selectTranslationOutput = (state: TranslationRootState): TranslationOutput | undefined =>
  selectTranslationState(state).translationOutput;
export const selectOriginalLanguageName = createSelector(
  selectTranslationOutput,
  (translationOutput) => translationOutput?.originalLanguageName,
);
export const selectInputTextSynonyms = createSelector(
  selectTranslationOutput,
  (translationOutput): string[] => translationOutput?.inputTextSynonymArr ?? EMPTY_SYNONYMS,
);
export const selectTranslationSynonyms = createSelector(
  selectTranslationOutput,
  (translationOutput): string[] => translationOutput?.translationSynonymArr ?? EMPTY_SYNONYMS,
);
export const selectExampleSentences = createSelector(
  selectTranslationOutput,
  (translationOutput): ExampleSentence[] => translationOutput?.exampleSentenceArr ?? EMPTY_EXAMPLE_SENTENCES,
);
