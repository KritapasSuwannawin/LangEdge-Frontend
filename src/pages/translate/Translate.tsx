import { useRef, useEffect } from 'react';

import { Spinner } from '@/shared/ui';
import { useAppSelector } from '@/app/store/hooks';
import {
  type Language,
  selectIsLanguageReady,
  selectOutputLanguage,
  useInitializeLanguages,
  useLanguageActions,
} from '@/entities/language';
import {
  type LastTranslationCacheEntry,
  isTranslationRequestErrorCode,
  selectIsTranslating,
  useTranslationActions,
} from '@/entities/translation';
import { selectLastUsedLanguageId, selectUserId, usePersistLastUsedLanguage } from '@/entities/user';
import { logErrorWithToast, toastInfo } from '@/shared/lib';

import './Translate.scss';
import InputSection from './sections/InputSection';
import TranslationSection from './sections/TranslationSection';
import SynonymSection from './sections/SynonymSection';
import ExampleSentenceSection from './sections/ExampleSentenceSection';

const TRANSLATION_ERROR_MESSAGES = {
  invalidInput: 'The input text is invalid',
  unauthorized: 'Your session has expired, please sign in again.',
  rateLimited: 'You have reached the limit, please try again later.',
  unexpected: null,
} as const;

function Translate() {
  const { setOutputLanguage } = useLanguageActions();
  const { clearTranslationOutput, requestTranslation, setTranslationOutput } = useTranslationActions();

  const userId = useAppSelector(selectUserId);
  const lastUsedLanguageId = useAppSelector(selectLastUsedLanguageId);

  const isLanguageReady = useAppSelector(selectIsLanguageReady);
  const isTranslating = useAppSelector(selectIsTranslating);
  const outputLanguage = useAppSelector(selectOutputLanguage);

  const inputSectionRef = useRef<{ setInputText: (inputText: string) => void }>(null);

  const lastTranslation = useRef<LastTranslationCacheEntry | undefined>(undefined);

  useInitializeLanguages(lastUsedLanguageId);
  usePersistLastUsedLanguage(outputLanguage?.id);

  // Output language change -> Clear translation output
  useEffect(() => {
    clearTranslationOutput();
  }, [clearTranslationOutput, outputLanguage]);

  // Sign out -> Clear input & translation output
  useEffect(() => {
    if (!userId) {
      inputSectionRef.current?.setInputText('');
      clearTranslationOutput();
    }
  }, [clearTranslationOutput, userId]);

  function translateHandler(inputText: string, outputLanguage: Language) {
    const trimmedInputText = inputText.trim();

    inputSectionRef.current?.setInputText(trimmedInputText);
    setOutputLanguage(outputLanguage);

    if (!trimmedInputText || isTranslating) {
      return;
    }

    // Input is the same as the last request -> Use the last result
    if (
      lastTranslation.current &&
      lastTranslation.current.inputText === trimmedInputText &&
      lastTranslation.current.outputLanguageId === outputLanguage.id
    ) {
      setTranslationOutput({
        originalLanguageName: lastTranslation.current.originalLanguageName,
        inputTextSynonymArr: lastTranslation.current.inputTextSynonymArr,
        translation: lastTranslation.current.translation,
        translationSynonymArr: lastTranslation.current.translationSynonymArr,
        exampleSentenceArr: lastTranslation.current.exampleSentenceArr,
      });

      return;
    }

    clearTranslationOutput();

    void requestTranslation({
      inputText: trimmedInputText,
      outputLanguageId: outputLanguage.id,
    })
      .then((translationOutput) => {
        lastTranslation.current = {
          inputText: trimmedInputText,
          outputLanguageId: outputLanguage.id,
          ...translationOutput,
        };

        if (translationOutput.originalLanguageName.toLowerCase() === outputLanguage.name.toLowerCase()) {
          toastInfo(`The input text is already in ${outputLanguage.name}`);
        }
      })
      .catch((error: unknown) => {
        const toastMessage = isTranslationRequestErrorCode(error) ? TRANSLATION_ERROR_MESSAGES[error] : undefined;

        logErrorWithToast('translate.request', error, { toastMessage });
      });
  }

  if (!isLanguageReady) {
    return (
      <div className="page-spinner-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="translate">
      <main className="translate__main">
        <InputSection ref={inputSectionRef} translateHandler={translateHandler} />

        <TranslationSection />
      </main>

      <SynonymSection type="inputSynonym" translateHandler={translateHandler} />

      <SynonymSection type="translationSynonym" translateHandler={translateHandler} />

      <ExampleSentenceSection />
    </div>
  );
}

export default Translate;
