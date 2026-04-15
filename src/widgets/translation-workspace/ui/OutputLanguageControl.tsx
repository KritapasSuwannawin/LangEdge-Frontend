import ChevronIcon from '@/assets/chevron.svg?react';
import { LanguageSelector, type Language } from '@/entities/language';

interface OutputLanguageControlProps {
  readonly isOpen: boolean;
  readonly languageArr: Language[];
  readonly languageButtonRef: React.RefObject<HTMLButtonElement>;
  readonly languageSelectorRef: React.RefObject<HTMLDivElement>;
  readonly outputLanguage: Language;
  readonly panelId: string;
  readonly onClose: () => void;
  readonly onLanguageSelect: (language: Language) => void;
  readonly onToggle: () => void;
}

function OutputLanguageControl(props: OutputLanguageControlProps): JSX.Element {
  const { isOpen, languageArr, languageButtonRef, languageSelectorRef, outputLanguage, panelId, onClose, onLanguageSelect, onToggle } =
    props;

  return (
    <>
      <button
        ref={languageButtonRef}
        type="button"
        className="language clickable"
        data-testid="translate-output-language-button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onToggle}
      >
        <p className="language__text">{outputLanguage.name}</p>
        <ChevronIcon className={`language__icon ${isOpen ? 'active' : ''}`} aria-hidden="true" />
      </button>

      <LanguageSelector
        panelId={panelId}
        ref={languageSelectorRef}
        isOpen={isOpen}
        languageArr={languageArr}
        selectedLanguage={outputLanguage}
        languageSelectHandler={onLanguageSelect}
        backButtonClickedHandler={onClose}
      />
    </>
  );
}

export default OutputLanguageControl;
