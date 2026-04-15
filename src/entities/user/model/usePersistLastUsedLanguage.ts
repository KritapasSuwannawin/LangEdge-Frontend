import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { ApiUnauthorizedError } from '@/shared/api';
import { eraseToken, logErrorWithToast, sessionExpired } from '@/shared/lib';

import { updateLastUsedLanguage } from '@/entities/user/api/updateLastUsedLanguage';

import { selectLastUsedLanguageId, selectUserId, userActions } from './userSlice';

export const usePersistLastUsedLanguage = (selectedLanguageId?: number): void => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);
  const lastUsedLanguageId = useAppSelector(selectLastUsedLanguageId);

  const previousSelectionRef = useRef<{ userId?: string; selectedLanguageId?: number }>({});

  useEffect(() => {
    const previousSelection = previousSelectionRef.current;
    previousSelectionRef.current = { userId, selectedLanguageId };

    if (!userId) {
      return;
    }

    if (previousSelection.userId !== userId) {
      return;
    }

    if (previousSelection.selectedLanguageId === undefined || previousSelection.selectedLanguageId === selectedLanguageId) {
      return;
    }

    if (selectedLanguageId === undefined || selectedLanguageId === lastUsedLanguageId) {
      return;
    }

    let isActive = true;

    void updateLastUsedLanguage(selectedLanguageId)
      .then(() => {
        if (!isActive) {
          return;
        }

        dispatch(userActions.setLastUsedLanguageId(selectedLanguageId));
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        if (error instanceof ApiUnauthorizedError) {
          eraseToken('accessToken');
          eraseToken('refreshToken');
          dispatch(sessionExpired());
        }

        logErrorWithToast('user.saveLastUsedLanguage', error);
      });

    return () => {
      isActive = false;
    };
  }, [dispatch, lastUsedLanguageId, selectedLanguageId, userId]);
};
