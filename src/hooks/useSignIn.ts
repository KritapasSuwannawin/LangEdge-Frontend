import { useCallback } from 'react';
import zod from 'zod';

import { googleSignIn } from '../externals/firebase';

import { useAppDispatch } from './useRedux';
import useFetch from './useFetch';

import { userActions } from '../store';

import { setToken } from '../utilities/browserUtility';

const useSignIn = () => {
  const dispatch = useAppDispatch();
  const fetch = useFetch();

  return useCallback(async () => {
    const { user } = await googleSignIn();

    const accessToken = await user.getIdToken();
    const { refreshToken } = user;

    const { ok, data, message } = await fetch('/api/user/sign-in', 'POST', { accessToken });

    if (!ok) {
      throw new Error(message);
    }

    const dataSchema = zod.object({
      userId: zod.string(),
      email: zod.string(),
      name: zod.string(),
      pictureUrl: zod.string().optional(),
    });

    const { success, data: userData } = dataSchema.safeParse(data);

    if (!success) {
      throw new Error('Invalid data format');
    }

    dispatch(userActions.setUser(userData));

    setToken('accessToken', accessToken);
    setToken('refreshToken', refreshToken);
  }, [dispatch, fetch]);
};

export default useSignIn;
