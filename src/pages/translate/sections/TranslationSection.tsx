import { useState, useRef, useCallback } from 'react';

import { Language } from '../../../interfaces';

import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import useClickOutsideHandler from '../../../hooks/useClickOutsideHandler';

import { translationActions } from '../../../store';

import LanguageSelector from '../../../components/languageSelector/LanguageSelector';

import ChevronIcon from '../../../assets/chevron.svg?react';

function TranslationSection() {
  const dispatch = useAppDispatch();

  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);

  const languageArr = useAppSelector((state) => state.translation.languageArr);
  const outputLanguage = useAppSelector((state) => state.translation.outputLanguage);
  const translationOutput = useAppSelector((state) => state.translation.translationOutput);

  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  const { translation } = translationOutput ?? {};

  const closeLanguageSelector = useCallback(() => {
    setIsOpenLanguageSelector(false);
  }, []);

  useClickOutsideHandler(isOpenLanguageSelector, closeLanguageSelector, [languageButtonRef, languageSelectorRef]);

  function languageButtonClickHandler() {
    setIsOpenLanguageSelector((prev) => !prev);
  }

  function languageSelectHandler(language: Language) {
    dispatch(translationActions.setOutputLanguage(language));
    setIsOpenLanguageSelector(false);
  }

  if (!languageArr || !outputLanguage) {
    return null;
  }

  return (
    <>
      <div className="translate__main--translation">
        <button ref={languageButtonRef} className="language clickable" onClick={languageButtonClickHandler}>
          <p className="language__text">{outputLanguage.name}</p>
          <ChevronIcon className={`language__icon ${isOpenLanguageSelector ? 'active' : ''}`} />
        </button>

        <div className="input-container">
          <textarea disabled value={translation ?? ''} />
        </div>
      </div>

      <LanguageSelector
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
