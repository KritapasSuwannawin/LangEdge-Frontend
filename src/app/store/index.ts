import { configureStore } from '@reduxjs/toolkit';

import type { LanguageState } from '@/entities/language/model/languageSlice';
import { languageReducer } from '@/entities/language/model';
import type { TranslationState } from '@/entities/translation/model/types';
import { translationReducer } from '@/entities/translation/model';
import type { UserState } from '@/entities/user/model/userSlice';
import { userReducer } from '@/entities/user/model';

export interface RootState {
  readonly user: UserState;
  readonly language: LanguageState;
  readonly translation: TranslationState;
}

const store = configureStore({
  reducer: { user: userReducer, language: languageReducer, translation: translationReducer },
});

export type AppDispatch = typeof store.dispatch;

export default store;

export { useAppDispatch, useAppSelector } from './hooks';
