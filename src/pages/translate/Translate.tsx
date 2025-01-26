import { useState, useRef, useEffect } from 'react';

import Language from '../../interface/Language';

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
  const [translation, setTranslation] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>(undefined);

  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);

  const lastTranslation = useRef<{ text: string; detectedLanguage: string; translation: string } | undefined>(undefined);

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

  // Output language change -> Reset translation
  useEffect(() => {
    setTranslation('');
  }, [outputLanguage]);

  // Input text change -> Reset detected language and translation
  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);

    setDetectedLanguage(undefined);
    setTranslation('');
  }

  function translateButtonClickHandler() {
    const trimmedInputText = inputText.trim();
    setInputText(trimmedInputText);

    if (!trimmedInputText || !outputLanguage || isTranslating) {
      return;
    }

    // Input is the same as the last request -> Use the last result
    if (lastTranslation.current?.text === trimmedInputText) {
      setDetectedLanguage(lastTranslation.current.detectedLanguage);
      setTranslation(lastTranslation.current.translation);

      return;
    }

    // Reset detected language and translation
    setDetectedLanguage(undefined);
    setTranslation('');

    setIsTranslating(true);

    const query = `?text=${encodeURIComponent(trimmedInputText)}&outputOutputLanguageId=${outputLanguage.id.toString()}`;

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

        const { originalLanguage, translation } = data as { originalLanguage: string; translation: string };

        setDetectedLanguage(originalLanguage);
        setTranslation(translation);

        lastTranslation.current = { text: trimmedInputText, detectedLanguage: originalLanguage, translation };
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
            <p className="language__text">Auto detect {detectedLanguage ? <>&ndash; {detectedLanguage}</> : ''}</p>
          </div>

          <div className="input-container">
            <textarea value={inputText} maxLength={100} onChange={inputTextChangeHandler} autoFocus />

            <div className="input-container__bottom">
              <span className="input-container__bottom--counter">{inputText.length} / 100</span>

              <button className="input-container__bottom--button" onClick={translateButtonClickHandler}>
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
    </div>
  );
}

export default Translate;
