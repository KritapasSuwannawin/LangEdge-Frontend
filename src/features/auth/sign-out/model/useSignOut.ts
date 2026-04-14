import { useCallback } from 'react';

import { userActions } from '@/entities/user';
import { eraseToken } from '@/shared/lib';

import { useAppDispatch } from '@/app/store';

const useSignOut = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    eraseToken('accessToken');
    eraseToken('refreshToken');

    dispatch(userActions.clearUser());
  }, [dispatch]);
};

export default useSignOut;
