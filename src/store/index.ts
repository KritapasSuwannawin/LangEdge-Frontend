import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import translationSlice from './translationSlice';

const store = configureStore({
  reducer: { user: userSlice.reducer, translation: translationSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export const userActions = userSlice.actions;
export const translationActions = translationSlice.actions;
