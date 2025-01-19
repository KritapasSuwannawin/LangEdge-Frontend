import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

export default settingSlice;
