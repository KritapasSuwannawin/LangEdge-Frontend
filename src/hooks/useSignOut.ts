import { useCallback } from 'react';

import { useAppDispatch } from './useRedux';

import { userActions } from '../store';

import { eraseToken } from '../utilities/browserUtility';

const useSignOut = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    eraseToken('accessToken');
    eraseToken('refreshToken');

    dispatch(userActions.clearUser());
  }, [dispatch]);
};

export default useSignOut;
