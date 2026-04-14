import { configureStore } from '@reduxjs/toolkit';

// Temporary bridge: slices live in @/store until Features 3 and 4 migrate them into
// their owning entity layers. This import path is intentional and will be removed then.
import userSlice from '@/store/userSlice';
import translationSlice from '@/store/translationSlice';

const store = configureStore({
  reducer: { user: userSlice.reducer, translation: translationSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export const userActions = userSlice.actions;
export const translationActions = translationSlice.actions;

export { useAppDispatch, useAppSelector } from './hooks';
