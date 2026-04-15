import { useState } from 'react';

import { Spinner } from '@/shared/ui';
import { logErrorWithToast } from '@/shared/lib';

import useSignIn from '@/features/auth/sign-in/model/useSignIn';

import '@/features/auth/sign-in/ui/SignInButton.scss';

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
    <button type="button" className="sign-in-btn" data-testid="nav-sign-in-button" onClick={signInClickHandler}>
      {isSigningIn ? <Spinner isThin /> : 'Sign in'}
    </button>
  );
}

export default SignInButton;
