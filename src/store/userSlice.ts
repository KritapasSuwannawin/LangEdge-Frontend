import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: undefined as string | undefined,
    email: undefined as string | undefined,
    name: undefined as string | undefined,
    pictureUrl: undefined as string | undefined,
  },
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; email: string; name: string; pictureUrl?: string }>) => {
      const { userId, email, name, pictureUrl } = action.payload;

      state.userId = userId;
      state.email = email;
      state.name = name;
      state.pictureUrl = pictureUrl;
    },
    clearUser: (state) => {
      state.userId = undefined;
      state.email = undefined;
      state.name = undefined;
      state.pictureUrl = undefined;
    },
  },
});

export default userSlice;
