import { useState, useRef, useEffect, useCallback } from 'react';

import { Language } from '../../interfaces';

import useFetch from '../../hooks/useFetch';

import { logError } from '../../module/systemModule';
import { toastInfo } from '../../module/toastModule';

import './Translate.scss';
import Spinner from '../../components/spinner/Spinner';

import ChevronIcon from '../../assets/chevron.svg?react';

function Translate() {
  const fetch = useFetch();

  const [languageArr, setLanguageArr] = useState<Language[]>([]);
  const [outputLanguage, setOutputLanguage] = useState<Language | undefined>(undefined);

  const [inputText, setInputText] = useState('');
  const [originalLanguage, setOriginalLanguage] = useState<string | undefined>(undefined);
  const [inputTextSynonymArr, setInputTextSynonymArr] = useState<string[]>([]);
  const [translation, setTranslation] = useState('');
  const [translationSynonymArr, setTranslationSynonymArr] = useState<string[]>([]);
  const [exampleSentenceArr, setExampleSentenceArr] = useState<{ sentence: string; translation: string }[]>([]);

  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);

  const lastTranslation = useRef<
    | {
        inputText: string;
        outputLanguageId: number;
        originalLanguage: string;
        inputTextSynonymArr: string[];
        translation: string;
        translationSynonymArr: string[];
        exampleSentenceArr: { sentence: string; translation: string }[];
      }
    | undefined
  >(undefined);

  const resetOutputState = useCallback(() => {
    setOriginalLanguage(undefined);
    setInputTextSynonymArr([]);
    setTranslation('');
    setTranslationSynonymArr([]);
    setExampleSentenceArr([]);
  }, []);

  // Load available languages
  useEffect(() => {
    fetch('/api/user/language')
      .then(({ ok, data, message }) => {
        if (!ok) {
          throw new Error(message);
        }

        const { languageArr } = data as { languageArr: Language[] };

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

  // Input text change -> Reset all output states
  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);

    resetOutputState();
  }

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
      setOriginalLanguage(lastTranslation.current.originalLanguage);
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
          switch (message) {
            case 'Invalid input':
              throw new Error('The input text is invalid');
            case 'Same language':
              data.originalLanguage = outputLanguage.name;
              data.translation = trimmedInputText;

              toastInfo(`The input text is already in ${outputLanguage.name}`, 5000);
              break;
            default:
              throw new Error(message);
          }
        }

        const {
          originalLanguage,
          inputTextSynonymArr = [],
          translation,
          translationSynonymArr = [],
          exampleSentenceArr = [],
        } = data as {
          originalLanguage: string;
          inputTextSynonymArr?: string[];
          translation: string;
          translationSynonymArr?: string[];
          exampleSentenceArr?: { sentence: string; translation: string }[];
        };

        setOriginalLanguage(originalLanguage);
        setInputTextSynonymArr(inputTextSynonymArr);
        setTranslation(translation);
        setTranslationSynonymArr(translationSynonymArr);
        setExampleSentenceArr(exampleSentenceArr);

        lastTranslation.current = {
          inputText: trimmedInputText,
          outputLanguageId: outputLanguage.id,
          originalLanguage,
          inputTextSynonymArr,
          translation,
          translationSynonymArr,
          exampleSentenceArr,
        };
      })
      .catch((err: unknown) => {
        logError('translate', err);
      })
      .finally(() => {
        setIsTranslating(false);
      });
  }

  function outputLanguageClickHandler() {
    setIsOpenLanguageSelector((prev) => !prev);
  }

  function languageSelectHandler(language: Language) {
    setOutputLanguage(language);
    setIsOpenLanguageSelector(false);
  }

  function synonymButtonClickHandler(options: { synonym: string; isSwapLanguage?: boolean }) {
    const { synonym, isSwapLanguage } = options;

    if (!outputLanguage) {
      return;
    }

    translate(
      synonym,
      isSwapLanguage ? languageArr.find((language) => language.name === originalLanguage) ?? outputLanguage : outputLanguage
    );
  }

  if (!outputLanguage) {
    return (
      <div className="translate__spinner-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="translate">
      <main className="translate__main">
        <div className="translate__main--left">
          <div className="language">
            <p className="language__text">Auto detect {originalLanguage ? <>&ndash; {originalLanguage}</> : ''}</p>
          </div>

          <div className="input-container">
            <textarea value={inputText} maxLength={400} onChange={inputTextChangeHandler} autoFocus />

            <div className="input-container__bottom">
              <span className="input-container__bottom--counter">{inputText.length} / 400</span>

              <button className="input-container__bottom--button" onClick={translate.bind(null, inputText, outputLanguage)}>
                {isTranslating ? <Spinner isThin isLight /> : 'Translate'}
              </button>
            </div>
          </div>
        </div>

        <div className="translate__main--right">
          <div className="language clickable" onClick={outputLanguageClickHandler}>
            <p className="language__text">{outputLanguage.name}</p>
            <ChevronIcon className={`language__icon ${isOpenLanguageSelector ? 'active' : ''}`} />
          </div>

          <div className="input-container">
            <textarea disabled value={translation} />
          </div>
        </div>

        {isOpenLanguageSelector && (
          <div className="translate__main--language-selector">
            {languageArr.map((language) => (
              <div
                key={language.id}
                className={`item ${outputLanguage.name === language.name ? 'selected' : ''}`}
                onClick={languageSelectHandler.bind(null, language)}
              >
                <p>{language.name}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {(inputTextSynonymArr.length > 0 || translationSynonymArr.length > 0) && (
        <section className="translate__synonym">
          {inputTextSynonymArr.length > 0 && (
            <div className="translate__synonym--left">
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
            <div className="translate__synonym--right">
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
        </section>
      )}

      {exampleSentenceArr.length > 0 && (
        <section className="translate__example-sentence">
          <h2 className="title">Example sentences</h2>

          <ul className="list-container">
            {exampleSentenceArr.map(({ sentence, translation }, index) => (
              <li key={index} className="item">
                <p className="sentence">{sentence}</p>
                <p className="translation">{translation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Translate;
