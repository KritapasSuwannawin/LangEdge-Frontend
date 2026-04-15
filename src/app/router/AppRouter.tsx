import { Routes, Route, Navigate } from 'react-router-dom';

import TranslatePage from '@/pages/translate';

function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/translate" element={<TranslatePage />} />
      <Route path="*" element={<Navigate to="/translate" />} />
    </Routes>
  );
}

export default AppRouter;
