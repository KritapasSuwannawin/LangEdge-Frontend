import { useState } from 'react';

import Spinner from '@/components/spinner/Spinner';
import useSignIn from '@/hooks/useSignIn';
import { logErrorWithToast } from '@/utilities/systemUtility';

import './SignInButton.scss';

function SignInButton() {
  const signIn = useSignIn();

  const [isSigningIn, setIsSigningIn] = useState(false);

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

  return (
    <button className="sign-in-btn" onClick={signInClickHandler}>
      {isSigningIn ? <Spinner isThin /> : 'Sign in'}
    </button>
  );
}

export default SignInButton;
