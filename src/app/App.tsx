import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Nav from '@/components/nav/Nav';
import { Spinner } from '@/shared/ui';
import useSignIn from '@/hooks/useSignIn';
import { AppRouter } from '@/app/router';
import { logError } from '@/shared/lib';

import './App.scss';

function App(): JSX.Element {
  const signIn = useSignIn();

  const [isSigningIn, setIsSigningIn] = useState(true);

  useEffect(() => {
    signIn({ isAutoSignIn: true })
      .catch((err: unknown) => {
        logError('auth.autoSignIn', err);
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  }, [signIn]);

  if (isSigningIn) {
    return (
      <div className="app-spinner-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="app">
      <Nav />

      <AppRouter />

      <ToastContainer newestOnTop />
    </div>
  );
}

export default App;
