import { useState, useRef, useEffect } from 'react';

import useFetch from '../../hooks/useFetch';

import { logError } from '../../module/systemModule';

import './Translate.scss';

function Translate() {
  const fetch = useFetch();

  const [inputText, setInputText] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');

  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputTextareaRef.current) {
      inputTextareaRef.current.focus();
    }
  }, []);

  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);
    setTranslation('');
  }

  function translateButtonClickHandler() {
    const trimmedInputText = inputText.trim();
    setInputText(trimmedInputText);

    if (!trimmedInputText) {
      return;
    }

    fetch(`/api/user/translation?text=${encodeURIComponent(trimmedInputText)}`)
      .then(({ ok, data, message }) => {
        if (!ok) {
          throw new Error(message);
        }

        const { translation } = data as { translation: string };

        setTranslation(translation);
      })
      .catch((err: unknown) => {
        logError('translate', err);
      });
  }

  return (
    <div className="translate">
      <main className="translate__main">
        <div className="translate__main--left">
          <p className="language-select">English</p>

          <div className="input-container">
            <textarea ref={inputTextareaRef} value={inputText} maxLength={100} onChange={inputTextChangeHandler} />

            <div className="input-container__bottom">
              <div className="input-container__bottom--counter">
                <span>{inputText.length} / 100</span>
              </div>

              <div className="input-container__bottom--button">
                <button onClick={translateButtonClickHandler}>Translate</button>
              </div>
            </div>
          </div>
        </div>

        <div className="translate__main--right">
          <p className="language-select">Thai</p>

          <div className="input-container">
            <textarea disabled value={translation} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Translate;
