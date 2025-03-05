import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import useSignIn from './hooks/useSignIn';

import { logError } from './utilities/systemUtility';

import './App.scss';
import Translate from './pages/translate/Translate';
import Nav from './components/nav/Nav';
import Spinner from './components/spinner/Spinner';

function App() {
  const signIn = useSignIn();

  const [isSigningIn, setIsSigningIn] = useState(true);

  useEffect(() => {
    signIn({ isAutoSignIn: true })
      .catch((err: unknown) => {
        logError('autoSignIn', err, null);
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
