import { useCallback } from 'react';

import { googleSignIn } from '@/shared/config';
import { getToken } from '@/shared/lib';
import { userActions, userSignInResponseSchema, type UserSignInData } from '@/entities/user';

import { useAppDispatch } from '@/app/store';
// Bridge until Feature 4: useFetch moves to a shared API primitive
import useFetch from '@/hooks/useFetch';

const useSignIn = () => {
  const dispatch = useAppDispatch();
  const fetch = useFetch();

  return useCallback(
    async (options: { isAutoSignIn?: boolean } = {}) => {
      const { isAutoSignIn = false } = options;

      let accessToken: string, refreshToken: string;

      if (isAutoSignIn) {
        const storedAccessToken = getToken('accessToken');
        const storedRefreshToken = getToken('refreshToken');

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error('No stored tokens');
        }

        accessToken = storedAccessToken;
        refreshToken = storedRefreshToken;
      } else {
        const { user } = await googleSignIn();

        accessToken = await user.getIdToken();
        refreshToken = user.refreshToken;
      }

      const { ok, data, message } = await fetch('/api/user/sign-in', 'POST', { accessToken, refreshToken });

      if (!ok) {
        throw new Error(message);
      }

      const parsedResult = userSignInResponseSchema.safeParse(data);

      if (!parsedResult.success) {
        throw new Error('Invalid data format');
      }

      const userData: UserSignInData = parsedResult.data;

      dispatch(userActions.setUser(userData));
    },
    [dispatch, fetch],
  );
};

export default useSignIn;
