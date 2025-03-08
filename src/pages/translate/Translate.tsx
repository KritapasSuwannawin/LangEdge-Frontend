import { useState, useRef, useEffect, useCallback } from 'react';
import zod from 'zod';

import { Language } from '../../interfaces';

import useFetch from '../../hooks/useFetch';
import { useAppSelector } from '../../hooks/useRedux';
import useSignIn from '../../hooks/useSignIn';
import useClickOutsideHandler from '../../hooks/useClickOutsideHandler';

import { logError } from '../../utilities/systemUtility';
import { toastInfo } from '../../utilities/toastUtility';

import './Translate.scss';
import Spinner from '../../components/spinner/Spinner';
import LanguageSelector from '../../components/languageSelector/LanguageSelector';

import ChevronIcon from '../../assets/chevron.svg?react';

function Translate() {
  const fetch = useFetch();
  const signIn = useSignIn();

  const userId = useAppSelector((state) => state.user.userId);

  const [languageArr, setLanguageArr] = useState<Language[]>([]);
  const [outputLanguage, setOutputLanguage] = useState<Language | undefined>(undefined);

  const [inputText, setInputText] = useState('');
  const [originalLanguageName, setOriginalLanguageName] = useState<string | undefined>(undefined);
  const [inputTextSynonymArr, setInputTextSynonymArr] = useState<string[]>([]);
  const [translation, setTranslation] = useState('');
  const [translationSynonymArr, setTranslationSynonymArr] = useState<string[]>([]);
  const [exampleSentenceArr, setExampleSentenceArr] = useState<{ sentence: string; translation: string }[]>([]);

  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const outputLanguageButtonRef = useRef<HTMLButtonElement>(null);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

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

  const isDoneInitializing = languageArr.length > 0 && outputLanguage;

  const resetOutputState = useCallback(() => {
    setOriginalLanguageName(undefined);
    setInputTextSynonymArr([]);
    setTranslation('');
    setTranslationSynonymArr([]);
    setExampleSentenceArr([]);
  }, []);

  const closeLanguageSelector = useCallback(() => {
    setIsOpenLanguageSelector(false);
  }, []);

  useClickOutsideHandler(isOpenLanguageSelector, closeLanguageSelector, [outputLanguageButtonRef, languageSelectorRef]);

  // Load available languages
  useEffect(() => {
    fetch('/api/user/language')
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

        setLanguageArr(languageArr.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((err: unknown) => {
        logError('language', err);
      });
  }, [fetch]);

  // Set output language to English
  useEffect(() => {
    if (languageArr.length === 0) {
      return;
    }

    let outputLanguage = languageArr.find((language) => language.name === 'English');

    if (!outputLanguage) {
      outputLanguage = languageArr[1];
    }

    setOutputLanguage(outputLanguage);
  }, [languageArr]);

  // Output language change -> Reset all output states
  useEffect(() => {
    resetOutputState();
  }, [outputLanguage, resetOutputState]);

  // Sign out -> Reset all output states
  useEffect(() => {
    if (!userId) {
      resetOutputState();
    }
  }, [userId, resetOutputState]);

  // Input text change -> Reset all output states
  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);

    resetOutputState();
  }

  // Main translation function
  function translate(inputText: string, outputLanguage: Language) {
    const trimmedInputText = inputText.trim();
    setInputText(trimmedInputText);
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
      setOriginalLanguageName(lastTranslation.current.originalLanguageName);
      setInputTextSynonymArr(lastTranslation.current.inputTextSynonymArr);
      setTranslation(lastTranslation.current.translation);
      setTranslationSynonymArr(lastTranslation.current.translationSynonymArr);
      setExampleSentenceArr(lastTranslation.current.exampleSentenceArr);

      return;
    }

    // Reset all output states
    resetOutputState();

    setIsTranslating(true);

    const query = `?text=${encodeURIComponent(trimmedInputText)}&outputLanguageId=${outputLanguage.id.toString()}`;

    fetch(`/api/user/translation${query}`)
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

        setOriginalLanguageName(originalLanguageName);
        setInputTextSynonymArr(inputTextSynonymArr);
        setTranslation(translation);
        setTranslationSynonymArr(translationSynonymArr);
        setExampleSentenceArr(exampleSentenceArr);

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
        setIsTranslating(false);
      });
  }

  // Output language button clicked -> Toggle language selector
  function outputLanguageButtonClickHandler() {
    setIsOpenLanguageSelector((prev) => !prev);
  }

  // Output language selected -> Close language selector
  function languageSelectHandler(language: Language) {
    setOutputLanguage(language);
    setIsOpenLanguageSelector(false);
  }

  // Synonym clicked -> Translate synonym
  function synonymButtonClickHandler(options: { synonym: string; isSwapLanguage?: boolean }) {
    const { synonym, isSwapLanguage } = options;

    if (!outputLanguage) {
      return;
    }

    translate(
      synonym,
      isSwapLanguage ? languageArr.find((language) => language.name === originalLanguageName) ?? outputLanguage : outputLanguage
    );
  }

  function signInClickHandler() {
    void (async () => {
      try {
        setIsSigningIn(true);

        await signIn();
      } catch (err) {
        logError('signInClickHandler', err, 'Failed to sign in');
      } finally {
        setIsSigningIn(false);
      }
    })();
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
        <div className="translate__main--input">
          <div className="language">
            <p className="language__text">Auto detect {originalLanguageName ? <>&ndash; {originalLanguageName}</> : ''}</p>
          </div>

          <div className="input-container">
            <textarea value={inputText} maxLength={400} onChange={inputTextChangeHandler} autoFocus />

            <div className="input-container__bottom">
              <span className="input-container__bottom--counter">{inputText.length} / 400</span>

              {userId ? (
                <button className="input-container__bottom--button" onClick={translate.bind(null, inputText, outputLanguage)}>
                  {isTranslating ? <Spinner isThin /> : 'Translate'}
                </button>
              ) : (
                <button className="input-container__bottom--button unauthenticated" onClick={signInClickHandler}>
                  {isSigningIn ? <Spinner isThin /> : 'Sign in'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="translate__main--translation">
          <button ref={outputLanguageButtonRef} className="language clickable" onClick={outputLanguageButtonClickHandler}>
            <p className="language__text">{outputLanguage.name}</p>
            <ChevronIcon className={`language__icon ${isOpenLanguageSelector ? 'active' : ''}`} />
          </button>

          <div className="input-container">
            <textarea disabled value={translation} />
          </div>
        </div>

        <LanguageSelector
          ref={languageSelectorRef}
          isOpen={isOpenLanguageSelector}
          languageArr={languageArr}
          selectedLanguage={outputLanguage}
          languageSelectHandler={languageSelectHandler}
          backButtonClickedHandler={closeLanguageSelector}
        ></LanguageSelector>
      </main>

      {inputTextSynonymArr.length > 0 && (
        <div className="translate__synonym">
          <h2 className="title">Synonyms</h2>

          <ul className="list-container">
            {inputTextSynonymArr.map((synonym, index) => (
              <li key={index} className="item">
                <button onClick={synonymButtonClickHandler.bind(null, { synonym })}>{synonym}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {translationSynonymArr.length > 0 && (
        <div className="translate__more-translation">
          <h2 className="title">More translations</h2>

          <ul className="list-container">
            {translationSynonymArr.map((synonym, index) => (
              <li key={index} className="item">
                <button onClick={synonymButtonClickHandler.bind(null, { synonym, isSwapLanguage: true })}>{synonym}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {exampleSentenceArr.length > 0 && (
        <div className="translate__example-sentence">
          <h2 className="title">Example sentences</h2>

          <ul className="list-container">
            {exampleSentenceArr.map(({ sentence, translation }, index) => (
              <li key={index} className="item">
                <p className="sentence">{sentence}</p>
                <p className="translation">{translation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Translate;
