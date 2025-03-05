import { useCallback } from 'react';

import { useAppDispatch } from './useRedux';

import { userActions } from '../store';

import { getToken, eraseToken } from '../utilities/browserUtility';

const useFetch = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (
      path = '/',
      method = 'GET',
      options: { body?: Record<string, unknown>; signal?: AbortSignal; accessToken?: string } = {}
    ): Promise<{ ok: boolean; data?: Record<string, unknown>; message: string }> => {
      const { body, signal, accessToken: inputAccessToken } = options;
      const accessToken = inputAccessToken ?? getToken('accessToken');

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL as string}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        body: body && JSON.stringify(body),
        signal,
      });

      const { ok, status } = res;

      if (!ok && status === 401) {
        // Clear access token
        eraseToken('accessToken');
        eraseToken('refreshToken');

        // Log out user
        dispatch(userActions.clearUser());

        // Reload page
        window.location.reload();
        return { ok: false, message: 'Unauthorized' };
      }

      const { data, message } = (await res.json()) as { data?: Record<string, unknown>; message?: string };

      return { ok, data, message: message ?? (!ok ? 'Unknown error' : 'Success') };
    },
    [dispatch]
  );
};

export default useFetch;
