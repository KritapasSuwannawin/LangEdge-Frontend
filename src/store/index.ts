import { configureStore } from '@reduxjs/toolkit';

import settingSlice from './settingSlice';

const store = configureStore({
  reducer: { setting: settingSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export const settingActions = settingSlice.actions;
