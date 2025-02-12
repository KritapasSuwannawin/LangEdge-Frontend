import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useAppSelector } from './hooks/useRedux';
import useAuth from './hooks/useAuth';

import { logError } from './utilities/systemUtility';

import './App.scss';
import Translate from './pages/translate/Translate';
import Spinner from './components/spinner/Spinner';
import Nav from './components/nav/Nav';

function App() {
  const auth = useAuth();

  const isAuthenticated = useAppSelector((state) => state.setting.isAuthenticated);

  useEffect(() => {
    auth().catch((err: unknown) => {
      logError('auth', err);
    });
  }, [auth]);

  if (!isAuthenticated) {
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
