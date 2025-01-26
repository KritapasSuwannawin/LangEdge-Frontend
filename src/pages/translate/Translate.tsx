import { useState, useRef, useEffect } from 'react';

import Language from '../../interface/Language';

import useFetch from '../../hooks/useFetch';

import { logError } from '../../module/systemModule';

import './Translate.scss';
import Spinner from '../../components/spinner/Spinner';

import ChevronIcon from '../../assets/chevron.svg?react';

function Translate() {
  const fetch = useFetch();

  const [languageArr, setLanguageArr] = useState<Language[]>([]);

  const [inputLanguage, setInputLanguage] = useState<Language | undefined>(undefined);
  const [outputLanguage, setOutputLanguage] = useState<Language | undefined>(undefined);

  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');

  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState<false | 'input' | 'output'>(false);

  const [isTranslating, setIsTranslating] = useState(false);

  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (languageArr.length === 0) {
      return;
    }

    if (inputTextareaRef.current) {
      inputTextareaRef.current.focus();
    }

    let inputLanguage: Language | undefined;
    let outputLanguage: Language | undefined;

    languageArr.forEach((language) => {
      switch (language.name) {
        case 'English':
          inputLanguage = language;
          break;
        case 'Thai':
          outputLanguage = language;
          break;
        default:
          break;
      }
    });

    if (!inputLanguage || !outputLanguage) {
      inputLanguage = languageArr[0];
      outputLanguage = languageArr[1];
    }

    setInputLanguage(inputLanguage);
    setOutputLanguage(outputLanguage);
  }, [languageArr]);

  useEffect(() => {
    setInputText('');
    setTranslation('');
  }, [inputLanguage, outputLanguage]);

  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);
    setTranslation('');
  }

  function translateButtonClickHandler() {
    const trimmedInputText = inputText.trim();
    setInputText(trimmedInputText);

    if (!trimmedInputText || !inputLanguage || !outputLanguage || isTranslating) {
      return;
    }

    setIsTranslating(true);

    const query = `?text=${encodeURIComponent(
      trimmedInputText
    )}&inputLanguageId=${inputLanguage.id.toString()}&outputOutputLanguageId=${outputLanguage.id.toString()}`;

    fetch(`/api/user/translation${query}`)
      .then(({ ok, data, message }) => {
        if (!ok) {
          throw new Error(message);
        }

        const { translation } = data as { translation: string };

        setTranslation(translation);
      })
      .catch((err: unknown) => {
        logError('translate', err);
      })
      .finally(() => {
        setIsTranslating(false);
      });
  }

  function inputLanguageClickHandler() {
    setIsOpenLanguageSelector((prev) => (prev ? false : 'input'));
  }

  function outputLanguageClickHandler() {
    setIsOpenLanguageSelector((prev) => (prev ? false : 'output'));
  }

  function languageSelectHandler(language: Language) {
    switch (isOpenLanguageSelector) {
      case 'input':
        setInputLanguage(language);

        if (outputLanguage?.id === language.id) {
          setOutputLanguage(inputLanguage);
        }
        break;
      case 'output':
        setOutputLanguage(language);

        if (inputLanguage?.id === language.id) {
          setInputLanguage(outputLanguage);
        }
        break;
      default:
        break;
    }

    setIsOpenLanguageSelector(false);
  }

  if (!inputLanguage || !outputLanguage) {
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
          <div className="language" onClick={inputLanguageClickHandler}>
            <p className="language__text">{inputLanguage.name}</p>
            <ChevronIcon className={`language__icon ${isOpenLanguageSelector === 'input' ? 'active' : ''}`} />
          </div>

          <div className="input-container">
            <textarea ref={inputTextareaRef} value={inputText} maxLength={100} onChange={inputTextChangeHandler} />

            <div className="input-container__bottom">
              <div className="input-container__bottom--counter">
                <span>{inputText.length} / 100</span>
              </div>

              <div className="input-container__bottom--button">
                <button onClick={translateButtonClickHandler}>{isTranslating ? <Spinner isThin isLight /> : 'Translate'}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="translate__main--right">
          <div className="language" onClick={outputLanguageClickHandler}>
            <p className="language__text">{outputLanguage.name}</p>
            <ChevronIcon className={`language__icon ${isOpenLanguageSelector === 'output' ? 'active' : ''}`} />
          </div>

          <div className="input-container">
            <textarea disabled value={translation} />
          </div>
        </div>

        {isOpenLanguageSelector && (
          <div className="translate__main--language-selector">
            {languageArr.map((language) => (
              <div key={language.id} className="item" onClick={languageSelectHandler.bind(null, language)}>
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
