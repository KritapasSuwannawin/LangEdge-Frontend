import { Spinner } from '@/shared/ui';

interface InputSectionProps {
  readonly inputText: string;
  readonly isAuthenticated: boolean;
  readonly isSigningIn: boolean;
  readonly isTranslating: boolean;
  readonly originalLanguageName: string | undefined;
  readonly onInputTextChange: (nextValue: string) => void;
  readonly onPrimaryActionClick: () => void;
}

function InputSection(props: InputSectionProps): JSX.Element {
  const { inputText, isAuthenticated, isSigningIn, isTranslating, originalLanguageName, onInputTextChange, onPrimaryActionClick } = props;

  const isPrimaryActionBusy = isAuthenticated ? isTranslating : isSigningIn;
  const primaryActionLabel = isAuthenticated ? 'Translate' : 'Sign in';
  const primaryActionTestId = isAuthenticated ? 'translate-submit-button' : 'translate-sign-in-button';

  return (
    <div className="translation-workspace__input">
      <div className="language">
        <p className="language__text">Auto detect {originalLanguageName ? <>- {originalLanguageName}</> : ''}</p>
      </div>

      <div className="input-container">
        <textarea
          data-testid="translate-input-textarea"
          aria-label="Text to translate"
          value={inputText}
          maxLength={400}
          onChange={(event) => onInputTextChange(event.target.value)}
          autoFocus
        />

        <div className="input-container__bottom">
          <span className="input-container__bottom--counter">{inputText.length} / 400</span>

          <button
            type="button"
            className={`input-container__bottom--button ${isAuthenticated ? '' : 'unauthenticated'}`.trim()}
            data-testid={primaryActionTestId}
            aria-busy={isPrimaryActionBusy}
            onClick={onPrimaryActionClick}
          >
            {isPrimaryActionBusy ? <Spinner isThin /> : primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputSection;
