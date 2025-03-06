import { useCallback } from 'react';
import zod from 'zod';

import { useAppDispatch } from './useRedux';

import { userActions } from '../store';

import { getToken, eraseToken, setToken } from '../utilities/browserUtility';
import { logError } from '../utilities/systemUtility';

const useFetch = () => {
  const dispatch = useAppDispatch();

  const refreshAccessToken = useCallback(async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL as string}/api/auth/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const { ok } = res;

    if (!ok) {
      throw new Error('Failed to refresh token');
    }

    const { data } = (await res.json()) as { data?: Record<string, unknown> };

    const dataSchema = zod.object({ accessToken: zod.string(), refreshToken: zod.string() });

    const { success, data: parsedData } = dataSchema.safeParse(data);

    if (!success) {
      throw new Error('Invalid data format');
    }

    return parsedData;
  }, []);

  const callback = useCallback(
    async (
      path = '/',
      method = 'GET',
      options: { body?: Record<string, unknown>; signal?: AbortSignal; accessToken?: string; refreshToken?: string } = {}
    ): Promise<{ ok: boolean; data?: Record<string, unknown>; message: string }> => {
      const { body, signal, accessToken: inputAccessToken, refreshToken: inputRefreshToken } = options;
      const accessToken = inputAccessToken ?? getToken('accessToken');
      const refreshToken = inputRefreshToken ?? getToken('refreshToken');

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

      if (status === 401) {
        // Refresh access token
        if (refreshToken) {
          try {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

            return await callback(path, method, { ...options, accessToken: newAccessToken, refreshToken: newRefreshToken });
          } catch (err) {
            logError('refreshAccessToken', err, null);
          }
        }

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

      if (accessToken && refreshToken) {
        setToken('accessToken', accessToken);
        setToken('refreshToken', refreshToken);
      }

      return { ok, data, message: message ?? (!ok ? 'Unknown error' : 'Success') };
    },
    [refreshAccessToken, dispatch]
  );

  return callback;
};

export default useFetch;
