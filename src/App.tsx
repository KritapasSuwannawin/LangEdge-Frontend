import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Nav from '@/components/nav/Nav';
import Spinner from '@/components/spinner/Spinner';
import useSignIn from '@/hooks/useSignIn';
import Translate from '@/pages/translate/Translate';
import { logError } from '@/utilities/systemUtility';

import './App.scss';

function App() {
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

      <Routes>
        <Route path="/translate" element={<Translate />} />
        <Route path="*" element={<Navigate to="/translate" />} />
      </Routes>

      <ToastContainer newestOnTop />
    </div>
  );
}

export default App;
