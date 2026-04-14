import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from '@/entities/user';
import translationSlice from '@/store/translationSlice';

const store = configureStore({
  reducer: { user: userReducer, translation: translationSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export const translationActions = translationSlice.actions;

export { useAppDispatch, useAppSelector } from './hooks';
