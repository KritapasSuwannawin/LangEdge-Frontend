import { useCallback } from 'react';

import { eraseToken, sessionExpired } from '@/shared/lib';

import { useAppDispatch } from '@/app/store';

const useSignOut = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    eraseToken('accessToken');
    eraseToken('refreshToken');

    dispatch(sessionExpired());
  }, [dispatch]);
};

export default useSignOut;
