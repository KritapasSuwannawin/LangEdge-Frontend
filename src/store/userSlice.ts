import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: undefined as string | undefined,
    email: undefined as string | undefined,
    name: undefined as string | undefined,
    pictureUrl: undefined as string | undefined,
    lastUsedLanguageId: undefined as number | undefined,
  },
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ userId: string; email: string; name: string; pictureUrl?: string; lastUsedLanguageId?: number }>
    ) => {
      const { userId, email, name, pictureUrl, lastUsedLanguageId } = action.payload;

      state.userId = userId;
      state.email = email;
      state.name = name;
      state.pictureUrl = pictureUrl;
      state.lastUsedLanguageId = lastUsedLanguageId;
    },
    clearUser: (state) => {
      state.userId = undefined;
      state.email = undefined;
      state.name = undefined;
      state.pictureUrl = undefined;
      state.lastUsedLanguageId = undefined;
    },
  },
});

export default userSlice;
