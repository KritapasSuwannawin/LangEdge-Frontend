import { useCallback, useRef, type RefObject } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { type Language, selectLanguageArr, selectOutputLanguage, useLanguageActions } from '@/entities/language';
import {
  type ExampleSentence,
  selectExampleSentences,
  selectInputTextSynonyms,
  selectOriginalLanguageName,
  selectTranslationOutput,
  selectTranslationSynonyms,
  useSubmitTranslation,
} from '@/entities/translation';

interface UseTranslationResultsResult {
  readonly exampleSentenceArr: ExampleSentence[];
  readonly inputTextSynonymArr: string[];
  readonly outputTextareaRef: RefObject<HTMLTextAreaElement>;
  readonly translation: string;
  readonly translationSynonymArr: string[];
  readonly handleInputTextSynonymClick: (synonym: string) => void;
  readonly handleTranslationSynonymClick: (synonym: string) => void;
}

const resolveSwappedOutputLanguage = (options: {
  readonly languageArr: Language[];
  readonly originalLanguageName: string | undefined;
  readonly outputLanguage: Language;
}): Language => {
  const { languageArr, originalLanguageName, outputLanguage } = options;

  return languageArr.find((language) => language.name === originalLanguageName) ?? outputLanguage;
};

export const useTranslationResults = (): UseTranslationResultsResult => {
  const submitTranslation = useSubmitTranslation();
  const { setOutputLanguage } = useLanguageActions();

  const languageArr = useAppSelector(selectLanguageArr);
  const outputLanguage = useAppSelector(selectOutputLanguage);
  const originalLanguageName = useAppSelector(selectOriginalLanguageName);
  const inputTextSynonymArr = useAppSelector(selectInputTextSynonyms);
  const translationSynonymArr = useAppSelector(selectTranslationSynonyms);
  const exampleSentenceArr = useAppSelector(selectExampleSentences);
  const translationOutput = useAppSelector(selectTranslationOutput);

  const outputTextareaRef = useRef<HTMLTextAreaElement>(null);

  const focusOutputTextarea = useCallback((): void => {
    outputTextareaRef.current?.focus();
  }, []);

  const submitSynonymTranslation = useCallback(
    (options: { readonly synonym: string; readonly isSwapLanguage?: boolean }): void => {
      if (!languageArr || !outputLanguage) {
        return;
      }

      focusOutputTextarea();

      const selectedOutputLanguage = options.isSwapLanguage
        ? resolveSwappedOutputLanguage({
            languageArr,
            originalLanguageName,
            outputLanguage,
          })
        : outputLanguage;

      if (options.isSwapLanguage && selectedOutputLanguage.id !== outputLanguage.id) {
        setOutputLanguage(selectedOutputLanguage);
      }

      void submitTranslation({
        inputText: options.synonym,
        outputLanguageId: selectedOutputLanguage.id,
        outputLanguageName: selectedOutputLanguage.name,
      });
    },
    [focusOutputTextarea, languageArr, originalLanguageName, outputLanguage, setOutputLanguage, submitTranslation],
  );

  const handleInputTextSynonymClick = useCallback(
    (synonym: string): void => {
      submitSynonymTranslation({ synonym });
    },
    [submitSynonymTranslation],
  );

  const handleTranslationSynonymClick = useCallback(
    (synonym: string): void => {
      submitSynonymTranslation({ synonym, isSwapLanguage: true });
    },
    [submitSynonymTranslation],
  );

  return {
    exampleSentenceArr,
    inputTextSynonymArr,
    outputTextareaRef,
    translation: translationOutput?.translation ?? '',
    translationSynonymArr,
    handleInputTextSynonymClick,
    handleTranslationSynonymClick,
  };
};
