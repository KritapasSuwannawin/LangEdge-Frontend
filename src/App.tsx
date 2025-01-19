import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useAppSelector } from './hooks/useRedux';
import useAuth from './hooks/useAuth';

import { logError } from './module/systemModule';

import './App.scss';
import Home from './pages/home/Home';
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
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}

      <ToastContainer newestOnTop />
    </div>
  );
}

export default App;
