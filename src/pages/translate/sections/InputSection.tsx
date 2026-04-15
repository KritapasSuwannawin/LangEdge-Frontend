import { useState, forwardRef, ForwardedRef, useImperativeHandle } from 'react';

import { useSignIn } from '@/features/auth/sign-in';
import { type Language, selectOutputLanguage } from '@/entities/language';
import { selectIsTranslating, selectOriginalLanguageName, useTranslationActions } from '@/entities/translation';
import { selectUserId } from '@/entities/user';
import { Spinner } from '@/shared/ui';
import { useAppSelector } from '@/app/store/hooks';
import { logErrorWithToast } from '@/shared/lib';

interface InputSectionProps {
  translateHandler: (inputText: string, outputLanguage: Language) => void;
}

function InputSection(props: InputSectionProps, ref: ForwardedRef<{ setInputText: (inputText: string) => void }>) {
  const { translateHandler } = props;

  const signIn = useSignIn();
  const { clearTranslationOutput } = useTranslationActions();

  const userId = useAppSelector(selectUserId);

  const outputLanguage = useAppSelector(selectOutputLanguage);
  const isTranslating = useAppSelector(selectIsTranslating);
  const originalLanguageName = useAppSelector(selectOriginalLanguageName);

  const [inputText, setInputText] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      setInputText,
    }),
    [],
  );

  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);

    clearTranslationOutput();
  }

  function signInClickHandler() {
    void (async () => {
      try {
        setIsSigningIn(true);

        await signIn();
      } catch (err) {
        logErrorWithToast('auth.signIn', err, { toastMessage: 'Failed to sign in' });
      } finally {
        setIsSigningIn(false);
      }
    })();
  }

  if (!outputLanguage) {
    return null;
  }

  return (
    <div className="translate__main--input">
      <div className="language">
        <p className="language__text">Auto detect {originalLanguageName ? <>&ndash; {originalLanguageName}</> : ''}</p>
      </div>

      <div className="input-container">
        <textarea
          data-testid="translate-input-textarea"
          aria-label="Text to translate"
          value={inputText}
          maxLength={400}
          onChange={inputTextChangeHandler}
          autoFocus
        />

        <div className="input-container__bottom">
          <span className="input-container__bottom--counter">{inputText.length} / 400</span>

          {userId ? (
            <button
              type="button"
              className="input-container__bottom--button"
              data-testid="translate-submit-button"
              onClick={translateHandler.bind(null, inputText, outputLanguage)}
            >
              {isTranslating ? <Spinner isThin /> : 'Translate'}
            </button>
          ) : (
            <button
              type="button"
              className="input-container__bottom--button unauthenticated"
              data-testid="translate-sign-in-button"
              onClick={signInClickHandler}
            >
              {isSigningIn ? <Spinner isThin /> : 'Sign in'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(InputSection);
