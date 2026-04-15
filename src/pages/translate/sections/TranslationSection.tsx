import { useId, useState, useRef, useCallback } from 'react';

import ChevronIcon from '@/assets/chevron.svg?react';
import { LanguageSelector, type Language, selectLanguageArr, selectOutputLanguage, useLanguageActions } from '@/entities/language';
import { selectTranslationOutput } from '@/entities/translation';
import { useClickOutsideHandler } from '@/shared/lib';
import { useAppSelector } from '@/app/store/hooks';

function TranslationSection() {
  const { setOutputLanguage } = useLanguageActions();

  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);
  const outputLanguageSelectorId = useId();

  const languageArr = useAppSelector(selectLanguageArr);
  const outputLanguage = useAppSelector(selectOutputLanguage);
  const translationOutput = useAppSelector(selectTranslationOutput);

  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  const translation = translationOutput?.translation ?? '';

  const closeLanguageSelector = useCallback(() => {
    setIsOpenLanguageSelector(false);
  }, []);

  useClickOutsideHandler(isOpenLanguageSelector, closeLanguageSelector, [languageButtonRef, languageSelectorRef]);

  function languageButtonClickHandler() {
    setIsOpenLanguageSelector((prev) => !prev);
  }

  function languageSelectHandler(language: Language) {
    setOutputLanguage(language);
    setIsOpenLanguageSelector(false);
  }

  if (!languageArr || !outputLanguage) {
    return null;
  }

  return (
    <>
      <div className="translate__main--translation">
        <button
          ref={languageButtonRef}
          type="button"
          className="language clickable"
          data-testid="translate-output-language-button"
          aria-expanded={isOpenLanguageSelector}
          aria-controls={outputLanguageSelectorId}
          onClick={languageButtonClickHandler}
        >
          <p className="language__text">{outputLanguage.name}</p>
          <ChevronIcon className={`language__icon ${isOpenLanguageSelector ? 'active' : ''}`} />
        </button>

        <div className="input-container">
          <textarea data-testid="translate-output-textarea" aria-label="Translation output" readOnly value={translation} />
        </div>
      </div>

      <LanguageSelector
        panelId={outputLanguageSelectorId}
        ref={languageSelectorRef}
        isOpen={isOpenLanguageSelector}
        languageArr={languageArr}
        selectedLanguage={outputLanguage}
        languageSelectHandler={languageSelectHandler}
        backButtonClickedHandler={closeLanguageSelector}
      />
    </>
  );
}

export default TranslationSection;
