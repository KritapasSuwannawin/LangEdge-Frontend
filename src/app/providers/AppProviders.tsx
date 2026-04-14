import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '@/app/store';

interface IAppProvidersProps {
  readonly children: ReactNode;
}

function AppProviders({ children }: IAppProvidersProps): JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
}

export default AppProviders;
