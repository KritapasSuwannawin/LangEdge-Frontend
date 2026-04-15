import { useCallback } from 'react';

import { googleSignIn } from '@/shared/config';
import { eraseToken, getToken, sessionExpired } from '@/shared/lib';
import { ApiUnauthorizedError, requestWithAuth } from '@/shared/api';
import { userActions, userSignInResponseSchema, type UserSignInData, type UserSignInPayload } from '@/entities/user';

import { useAppDispatch } from '@/app/store';

import { resolveE2EAuthTokens } from '@/features/auth/sign-in/lib/resolveE2EAuthTokens';

const useSignIn = (): ((options?: { isAutoSignIn?: boolean }) => Promise<void>) => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (options: { isAutoSignIn?: boolean } = {}) => {
      const { isAutoSignIn = false } = options;

      let authTokens: UserSignInPayload;

      if (isAutoSignIn) {
        const storedAccessToken = getToken('accessToken');
        const storedRefreshToken = getToken('refreshToken');

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error('No stored tokens');
        }

        authTokens = {
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        };
      } else {
        const e2eAuthTokens = resolveE2EAuthTokens();

        if (e2eAuthTokens) {
          authTokens = e2eAuthTokens;
        } else {
          const { user } = await googleSignIn();

          authTokens = {
            accessToken: await user.getIdToken(),
            refreshToken: user.refreshToken,
          };
        }
      }

      try {
        const response = await requestWithAuth<unknown>({
          path: '/api/user/sign-in',
          method: 'POST',
          ...authTokens,
        });

        const parsedResult = userSignInResponseSchema.safeParse(response.data);

        if (!parsedResult.success) {
          throw new Error('Invalid data format');
        }

        const userData: UserSignInData = parsedResult.data;

        dispatch(userActions.setUser(userData));
      } catch (error) {
        if (error instanceof ApiUnauthorizedError) {
          eraseToken('accessToken');
          eraseToken('refreshToken');
          dispatch(sessionExpired());
        }

        throw error;
      }
    },
    [dispatch],
  );
};

export default useSignIn;
