import type { TranslationResponse } from '../api/translationApi';

import type { TranslationOutput } from './types';

export const normalizeTranslationResponse = (translationResponse: TranslationResponse): TranslationOutput => {
  return {
    originalLanguageName: translationResponse.originalLanguageName,
    inputTextSynonymArr: translationResponse.inputTextSynonymArr ?? [],
    translation: translationResponse.translation,
    translationSynonymArr: translationResponse.translationSynonymArr ?? [],
    exampleSentenceArr: translationResponse.exampleSentenceArr ?? [],
  };
};
