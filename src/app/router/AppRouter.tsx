import { Routes, Route, Navigate } from 'react-router-dom';

import Translate from '@/pages/translate/Translate';

function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/translate" element={<Translate />} />
      <Route path="*" element={<Navigate to="/translate" />} />
    </Routes>
  );
}

export default AppRouter;
