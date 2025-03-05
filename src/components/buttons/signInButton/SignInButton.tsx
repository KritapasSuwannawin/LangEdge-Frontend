import { useState } from 'react';

import useSignIn from '../../../hooks/useSignIn';

import { logError } from '../../../utilities/systemUtility';

import './SignInButton.scss';
import Spinner from '../../spinner/Spinner';

function SignInButton() {
  const signIn = useSignIn();

  const [isSigningIn, setIsSigningIn] = useState(false);

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

  return (
    <button className="sign-in-btn" onClick={signInClickHandler}>
      {isSigningIn ? <Spinner isThin /> : 'Sign in'}
    </button>
  );
}

export default SignInButton;
