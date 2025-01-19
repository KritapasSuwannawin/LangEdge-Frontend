import { useCallback } from 'react';

import { getCookie } from '../module/browserModule';

const useFetch = () => {
  return useCallback(
    async (
      path = '/',
      method = 'GET',
      options: { body?: Record<string, unknown>; signal?: AbortSignal } = {}
    ): Promise<{ ok: boolean; data?: Record<string, unknown>; message: string }> => {
      const { body, signal } = options;
      const authToken = getCookie('authToken');

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL as string}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
        body: body && JSON.stringify(body),
        signal,
      });

      const { ok, status } = res;

      if (!ok && [401, 403].includes(status)) {
        window.location.reload(); // reload page
        return { ok: false, message: 'Unauthorized' };
      }

      const { data, message } = (await res.json()) as { data?: Record<string, unknown>; message?: string };

      return { ok, data, message: message ?? (!ok ? 'Unknown error' : 'Success') };
    },
    []
  );
};

export default useFetch;
