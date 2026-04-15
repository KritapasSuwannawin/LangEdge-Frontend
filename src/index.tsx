import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/app/providers';
import App from '@/app/App';

import '@/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

createRoot(rootElement).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
