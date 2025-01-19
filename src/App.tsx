import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useAppSelector } from './hooks/useRedux';
import useAuth from './hooks/useAuth';

import { logError } from './module/systemModule';

import './App.scss';
import Translate from './pages/translate/Translate';
import Loader from './components/loader/Loader';
import Nav from './components/nav/Nav';

function App() {
  const auth = useAuth();

  const isAuthenticated = useAppSelector((state) => state.setting.isAuthenticated);

  useEffect(() => {
    auth().catch((err: unknown) => {
      logError('auth', err);
    });
  }, [auth]);

  return (
    <div className="app">
      {!isAuthenticated ? (
        <div className="app__loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <Nav />

          <Routes>
            <Route path="/translate" element={<Translate />} />
            <Route path="*" element={<Navigate to="/translate" />} />
          </Routes>
        </>
      )}

      <ToastContainer newestOnTop />
    </div>
  );
}

export default App;
