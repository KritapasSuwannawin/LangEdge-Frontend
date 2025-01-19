import { useCallback } from 'react';

import useFetch from './useFetch';
import { useAppDispatch } from './useRedux';

import { settingActions } from '../store';

import { setCookie } from '../module/browserModule';

const useAuth = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    const { ok, data, message } = await fetch('/api/auth/token');

    if (!ok) {
      throw new Error(message);
    }

    const { token } = data as { token: string };

    setCookie('authToken', token);
    dispatch(settingActions.setIsAuthenticated(true));
  }, [fetch, dispatch]);
};

export default useAuth;
