export type {
  ExampleSentence,
  LastTranslationCacheEntry,
  SubmitTranslationParams,
  TranslationOutput,
  TranslationRequestParams,
  TranslationState,
} from '@/entities/translation/model/types';
export { translationActions, translationReducer } from '@/entities/translation/model/translationSlice';
export {
  selectExampleSentences,
  selectInputTextSynonyms,
  selectIsTranslating,
  selectLastTranslationCache,
  selectOriginalLanguageName,
  selectTranslationInputText,
  selectTranslationOutput,
  selectTranslationSynonyms,
} from '@/entities/translation/model/selectors';
export { requestTranslationThunk } from '@/entities/translation/model/thunks';
export { useTranslationActions } from '@/entities/translation/model/hooks';
export { useSubmitTranslation } from '@/entities/translation/model/useSubmitTranslation';
export type { TranslationRequestErrorCode, TranslationResponse } from '@/entities/translation/api/translationApi';
export { isTranslationRequestErrorCode, requestTranslation, translationResponseSchema } from '@/entities/translation/api/translationApi';
