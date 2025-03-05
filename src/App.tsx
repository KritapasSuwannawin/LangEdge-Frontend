import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './App.scss';
import Translate from './pages/translate/Translate';
import Nav from './components/nav/Nav';

function App() {
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
