import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { sessionExpired } from '@/shared/lib';

interface UserSliceState {
  userId: string | undefined;
  email: string | undefined;
  name: string | undefined;
  pictureUrl: string | undefined;
  lastUsedLanguageId: number | undefined;
}

const initialState: UserSliceState = {
  userId: undefined,
  email: undefined,
  name: undefined,
  pictureUrl: undefined,
  lastUsedLanguageId: undefined,
};

const clearUserState = (state: UserSliceState): void => {
  state.userId = undefined;
  state.email = undefined;
  state.name = undefined;
  state.pictureUrl = undefined;
  state.lastUsedLanguageId = undefined;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ userId: string; email: string; name: string; pictureUrl?: string; lastUsedLanguageId?: number }>,
    ) => {
      const { userId, email, name, pictureUrl, lastUsedLanguageId } = action.payload;

      state.userId = userId;
      state.email = email;
      state.name = name;
      state.pictureUrl = pictureUrl;
      state.lastUsedLanguageId = lastUsedLanguageId;
    },
    setLastUsedLanguageId: (state, action: PayloadAction<number | undefined>) => {
      state.lastUsedLanguageId = action.payload;
    },
    clearUser: clearUserState,
  },
  extraReducers: (builder) => {
    builder.addCase(sessionExpired, clearUserState);
  },
});

export type UserState = UserSliceState;

interface UserRootState {
  user: UserState;
}

export const selectUserId = (state: UserRootState): string | undefined => state.user.userId;
export const selectUserName = (state: UserRootState): string | undefined => state.user.name;
export const selectUserEmail = (state: UserRootState): string | undefined => state.user.email;
export const selectUserPictureUrl = (state: UserRootState): string | undefined => state.user.pictureUrl;
export const selectLastUsedLanguageId = (state: UserRootState): number | undefined => state.user.lastUsedLanguageId;

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
