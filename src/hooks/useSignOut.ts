import { useCallback } from 'react';

import { userActions } from '@/store';
import { eraseToken } from '@/utilities/browserUtility';

import { useAppDispatch } from './useRedux';

const useSignOut = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    eraseToken('accessToken');
    eraseToken('refreshToken');

    dispatch(userActions.clearUser());
  }, [dispatch]);
};

export default useSignOut;
