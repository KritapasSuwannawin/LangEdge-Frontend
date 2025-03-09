import { useRef, useEffect } from 'react';
import zod from 'zod';

import { Language } from '../../interfaces';

import useFetch from '../../hooks/useFetch';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';

import { translationActions } from '../../store';

import { logError } from '../../utilities/systemUtility';
import { toastInfo } from '../../utilities/toastUtility';

import './Translate.scss';
import Spinner from '../../components/spinner/Spinner';
import InputSection from './sections/InputSection';
import TranslationSection from './sections/TranslationSection';
import SynonymSection from './sections/SynonymSection';
import ExampleSentenceSection from './sections/ExampleSentenceSection';

function Translate() {
  const dispatch = useAppDispatch();
  const fetch = useFetch();

  const userId = useAppSelector((state) => state.user.userId);
  const lastUsedLanguageId = useAppSelector((state) => state.user.lastUsedLanguageId);

  const languageArr = useAppSelector((state) => state.translation.languageArr);
  const isTranslating = useAppSelector((state) => state.translation.isTranslating);
  const outputLanguage = useAppSelector((state) => state.translation.outputLanguage);

  const inputSectionRef = useRef<{ setInputText: (inputText: string) => void }>(null);

  const lastTranslation = useRef<
    | {
        inputText: string;
        outputLanguageId: number;
        originalLanguageName: string;
        inputTextSynonymArr: string[];
        translation: string;
        translationSynonymArr: string[];
        exampleSentenceArr: { sentence: string; translation: string }[];
      }
    | undefined
  >(undefined);

  const isDoneInitializing = languageArr && languageArr.length > 0 && outputLanguage;

  // Load available languages
  useEffect(() => {
    fetch('/api/language')
      .then(({ ok, data, message }) => {
        if (!ok) {
          throw new Error(message);
        }

        const dataSchema = zod.object({
          languageArr: zod.array(
            zod.object({
              id: zod.number(),
              name: zod.string(),
              code: zod.string(),
            })
          ),
        });

        const { success, data: parseData } = dataSchema.safeParse(data);

        if (!success) {
          throw new Error('Invalid data format');
        }

        const { languageArr } = parseData;

        if (languageArr.length === 0) {
          throw new Error('No language available');
        }

        dispatch(translationActions.setLanguageArr(languageArr.sort((a, b) => a.name.localeCompare(b.name))));
      })
      .catch((err: unknown) => {
        logError('language', err);
      });
  }, [fetch, dispatch]);

  // Set output language to last used language or English
  useEffect(() => {
    if (!languageArr) {
      return;
    }

    let outputLanguage = languageArr.find((language) =>
      lastUsedLanguageId ? language.id === lastUsedLanguageId : language.name === 'English'
    );

    if (!outputLanguage) {
      outputLanguage = languageArr[1];
    }

    dispatch(translationActions.setOutputLanguage(outputLanguage));
  }, [languageArr, lastUsedLanguageId, dispatch]);

  // Output language change -> Clear translation output
  useEffect(() => {
    dispatch(translationActions.clearTranslationOutput());
  }, [outputLanguage, dispatch]);

  // Sign out -> Clear translation output
  useEffect(() => {
    if (!userId) {
      dispatch(translationActions.clearTranslationOutput());
    }
  }, [userId, dispatch]);

  // Signed in && Output language change -> Save last used language
  useEffect(() => {
    if (!userId || !outputLanguage) {
      return;
    }

    fetch('/api/user', 'PATCH', { body: { lastUsedLanguageId: outputLanguage.id } })
      .then(({ ok }) => {
        if (!ok) {
          throw new Error('Failed to save last used language');
        }
      })
      .catch((err: unknown) => {
        logError('saveLastUsedLanguage', err);
      });
  }, [userId, outputLanguage, fetch]);

  function translateHandler(inputText: string, outputLanguage: Language) {
    const trimmedInputText = inputText.trim();

    inputSectionRef.current?.setInputText(trimmedInputText);
    dispatch(translationActions.setOutputLanguage(outputLanguage));

    if (!trimmedInputText || isTranslating) {
      return;
    }

    // Input is the same as the last request -> Use the last result
    if (
      lastTranslation.current &&
      lastTranslation.current.inputText === trimmedInputText &&
      lastTranslation.current.outputLanguageId === outputLanguage.id
    ) {
      dispatch(
        translationActions.setTranslationOutput({
          originalLanguageName: lastTranslation.current.originalLanguageName,
          inputTextSynonymArr: lastTranslation.current.inputTextSynonymArr,
          translation: lastTranslation.current.translation,
          translationSynonymArr: lastTranslation.current.translationSynonymArr,
          exampleSentenceArr: lastTranslation.current.exampleSentenceArr,
        })
      );

      return;
    }

    dispatch(translationActions.clearTranslationOutput());
    dispatch(translationActions.setIsTranslating(true));

    const query = `?text=${encodeURIComponent(trimmedInputText)}&outputLanguageId=${outputLanguage.id.toString()}`;

    fetch(`/api/translation${query}`)
      .then(({ ok, data = {}, message }) => {
        if (!ok) {
          let errorMessage: string | null;

          switch (message) {
            case 'Invalid input':
              errorMessage = 'The input text is invalid';
              break;
            case 'Unauthorized':
              errorMessage = 'Your session has expired, please sign in again.';
              break;
            case 'Too many requests':
              errorMessage = 'You have reached the limit, please try again later.';
              break;
            default:
              errorMessage = null;
              break;
          }

          logError('translate', new Error(message), errorMessage);
          return;
        }

        const dataSchema = zod.object({
          originalLanguageName: zod.string(),
          inputTextSynonymArr: zod.array(zod.string()).optional(),
          translation: zod.string(),
          translationSynonymArr: zod.array(zod.string()).optional(),
          exampleSentenceArr: zod
            .array(
              zod.object({
                sentence: zod.string(),
                translation: zod.string(),
              })
            )
            .optional(),
        });

        const { success, data: parseData } = dataSchema.safeParse(data);

        if (!success) {
          throw new Error('Invalid data format');
        }

        const {
          originalLanguageName,
          inputTextSynonymArr = [],
          translation,
          translationSynonymArr = [],
          exampleSentenceArr = [],
        } = parseData;

        dispatch(
          translationActions.setTranslationOutput({
            originalLanguageName,
            inputTextSynonymArr,
            translation,
            translationSynonymArr,
            exampleSentenceArr,
          })
        );

        lastTranslation.current = {
          inputText: trimmedInputText,
          outputLanguageId: outputLanguage.id,
          originalLanguageName,
          inputTextSynonymArr,
          translation,
          translationSynonymArr,
          exampleSentenceArr,
        };

        // Same language
        if (originalLanguageName.toLowerCase() === outputLanguage.name.toLowerCase()) {
          toastInfo(`The input text is already in ${outputLanguage.name}`);
        }
      })
      .catch((err: unknown) => {
        logError('translate', err);
      })
      .finally(() => {
        dispatch(translationActions.setIsTranslating(false));
      });
  }

  if (!isDoneInitializing) {
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
