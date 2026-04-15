export interface ExampleSentence {
  readonly sentence: string;
  readonly translation: string;
}

export interface TranslationOutput {
  readonly originalLanguageName: string;
  readonly inputTextSynonymArr: string[];
  readonly translation: string;
  readonly translationSynonymArr: string[];
  readonly exampleSentenceArr: ExampleSentence[];
}

export interface LastTranslationCacheEntry extends TranslationOutput {
  readonly inputText: string;
  readonly outputLanguageId: number;
}

export interface SubmitTranslationParams {
  readonly inputText: string;
  readonly outputLanguageId: number;
  readonly outputLanguageName: string;
}

export interface TranslationState {
  readonly inputText: string;
  readonly isTranslating: boolean;
  readonly translationOutput: TranslationOutput | undefined;
  readonly lastTranslationCache: LastTranslationCacheEntry | undefined;
}

export interface TranslationRequestParams {
  readonly inputText: string;
  readonly outputLanguageId: number;
}
