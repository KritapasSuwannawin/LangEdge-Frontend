import { useState, forwardRef, ForwardedRef, useImperativeHandle } from 'react';

import { Language } from '../../../interfaces';

import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import useSignIn from '../../../hooks/useSignIn';

import { translationActions } from '../../../store';

import { logError } from '../../../utilities/systemUtility';

import Spinner from '../../../components/spinner/Spinner';

interface InputSectionProps {
  translateHandler: (inputText: string, outputLanguage: Language) => void;
}

function InputSection(props: InputSectionProps, ref: ForwardedRef<{ setInputText: (inputText: string) => void }>) {
  const { translateHandler } = props;

  const dispatch = useAppDispatch();
  const signIn = useSignIn();

  const userId = useAppSelector((state) => state.user.userId);

  const outputLanguage = useAppSelector((state) => state.translation.outputLanguage);
  const isTranslating = useAppSelector((state) => state.translation.isTranslating);
  const translationOutput = useAppSelector((state) => state.translation.translationOutput);

  const [inputText, setInputText] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const { originalLanguageName } = translationOutput ?? {};

  useImperativeHandle(
    ref,
    () => ({
      setInputText,
    }),
    []
  );

  function inputTextChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(event.target.value);

    dispatch(translationActions.clearTranslationOutput());
  }

  function signInClickHandler() {
    void (async () => {
      try {
        setIsSigningIn(true);

        await signIn();
      } catch (err) {
        logError('signInClickHandler', err, 'Failed to sign in');
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
        <textarea value={inputText} maxLength={400} onChange={inputTextChangeHandler} autoFocus />

        <div className="input-container__bottom">
          <span className="input-container__bottom--counter">{inputText.length} / 400</span>

          {userId ? (
            <button className="input-container__bottom--button" onClick={translateHandler.bind(null, inputText, outputLanguage)}>
              {isTranslating ? <Spinner isThin /> : 'Translate'}
            </button>
          ) : (
            <button className="input-container__bottom--button unauthenticated" onClick={signInClickHandler}>
              {isSigningIn ? <Spinner isThin /> : 'Sign in'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(InputSection);
