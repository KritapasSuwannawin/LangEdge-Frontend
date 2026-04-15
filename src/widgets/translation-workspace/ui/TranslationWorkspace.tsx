import { useTranslationWorkspace } from '@/widgets/translation-workspace/model/useTranslationWorkspace';

import InputSection from './InputSection';
import OutputLanguageControl from './OutputLanguageControl';

import './TranslationWorkspace.scss';

function TranslationWorkspace(): JSX.Element | null {
  const {
    inputText,
    isAuthenticated,
    isLanguageSelectorOpen,
    isSigningIn,
    isTranslating,
    languageArr,
    languageButtonRef,
    languageSelectorRef,
    originalLanguageName,
    outputLanguage,
    outputLanguageSelectorId,
    handleInputTextChange,
    handleLanguageSelect,
    handleLanguageSelectorClose,
    handleLanguageSelectorToggle,
    handlePrimaryActionClick,
  } = useTranslationWorkspace();

  if (!languageArr || !outputLanguage) {
    return null;
  }

  return (
    <>
      <InputSection
        inputText={inputText}
        isAuthenticated={isAuthenticated}
        isSigningIn={isSigningIn}
        isTranslating={isTranslating}
        originalLanguageName={originalLanguageName}
        onInputTextChange={handleInputTextChange}
        onPrimaryActionClick={handlePrimaryActionClick}
      />

      <div className="translation-workspace__control">
        <OutputLanguageControl
          isOpen={isLanguageSelectorOpen}
          languageArr={languageArr}
          languageButtonRef={languageButtonRef}
          languageSelectorRef={languageSelectorRef}
          outputLanguage={outputLanguage}
          panelId={outputLanguageSelectorId}
          onClose={handleLanguageSelectorClose}
          onLanguageSelect={handleLanguageSelect}
          onToggle={handleLanguageSelectorToggle}
        />
      </div>
    </>
  );
}

export default TranslationWorkspace;
