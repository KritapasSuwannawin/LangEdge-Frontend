import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { type Language, selectLanguageArr, selectOutputLanguage, useLanguageActions } from '@/entities/language';
import {
  selectIsTranslating,
  selectOriginalLanguageName,
  selectTranslationInputText,
  useSubmitTranslation,
  useTranslationActions,
} from '@/entities/translation';
import { selectUserId, usePersistLastUsedLanguage } from '@/entities/user';
import { useSignIn } from '@/features/auth/sign-in';
import { logErrorWithToast, useClickOutsideHandler } from '@/shared/lib';

interface UseTranslationWorkspaceResult {
  readonly inputText: string;
  readonly isAuthenticated: boolean;
  readonly isLanguageSelectorOpen: boolean;
  readonly isSigningIn: boolean;
  readonly isTranslating: boolean;
  readonly languageArr: Language[] | undefined;
  readonly languageButtonRef: RefObject<HTMLButtonElement>;
  readonly languageSelectorRef: RefObject<HTMLDivElement>;
  readonly originalLanguageName: string | undefined;
  readonly outputLanguage: Language | undefined;
  readonly outputLanguageSelectorId: string;
  readonly handleInputTextChange: (nextValue: string) => void;
  readonly handleLanguageSelect: (language: Language) => void;
  readonly handleLanguageSelectorClose: () => void;
  readonly handleLanguageSelectorToggle: () => void;
  readonly handlePrimaryActionClick: () => void;
}

export const useTranslationWorkspace = (): UseTranslationWorkspaceResult => {
  const signIn = useSignIn();
  const submitTranslation = useSubmitTranslation();
  const { setOutputLanguage } = useLanguageActions();
  const { clearTranslationOutput, setInputText } = useTranslationActions();

  const languageArr = useAppSelector(selectLanguageArr);
  const outputLanguage = useAppSelector(selectOutputLanguage);
  const isTranslating = useAppSelector(selectIsTranslating);
  const inputText = useAppSelector(selectTranslationInputText);
  const originalLanguageName = useAppSelector(selectOriginalLanguageName);
  const userId = useAppSelector(selectUserId);

  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const outputLanguageSelectorId = useId();

  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  usePersistLastUsedLanguage(outputLanguage?.id);

  const restoreLanguageTriggerFocus = useCallback((): void => {
    setTimeout(() => {
      languageButtonRef.current?.focus();
    }, 0);
  }, []);

  const closeLanguageSelector = useCallback(
    (options: { restoreFocus?: boolean } = {}): void => {
      setIsLanguageSelectorOpen(false);

      if (options.restoreFocus) {
        restoreLanguageTriggerFocus();
      }
    },
    [restoreLanguageTriggerFocus],
  );

  useClickOutsideHandler(isLanguageSelectorOpen, () => {
    closeLanguageSelector({ restoreFocus: true });
  }, [languageButtonRef, languageSelectorRef]);

  useEffect(() => {
    if (userId) {
      return;
    }

    setInputText('');
    clearTranslationOutput();
  }, [clearTranslationOutput, setInputText, userId]);

  const handleInputTextChange = useCallback(
    (nextValue: string): void => {
      setInputText(nextValue);
      clearTranslationOutput();
    },
    [clearTranslationOutput, setInputText],
  );

  const handlePrimaryActionClick = useCallback((): void => {
    if (!outputLanguage) {
      return;
    }

    if (!userId) {
      if (isSigningIn) {
        return;
      }

      void (async () => {
        try {
          setIsSigningIn(true);

          await signIn();
        } catch (error: unknown) {
          logErrorWithToast('auth.signIn', error, { toastMessage: 'Failed to sign in' });
        } finally {
          setIsSigningIn(false);
        }
      })();

      return;
    }

    if (isTranslating) {
      return;
    }

    const trimmedInputText = inputText.trim();

    void submitTranslation({
      inputText: trimmedInputText,
      outputLanguageId: outputLanguage.id,
      outputLanguageName: outputLanguage.name,
    });
  }, [inputText, isSigningIn, isTranslating, outputLanguage, signIn, submitTranslation, userId]);

  const handleLanguageSelectorToggle = useCallback((): void => {
    setIsLanguageSelectorOpen((previousState) => !previousState);
  }, []);

  const handleLanguageSelect = useCallback(
    (language: Language): void => {
      setOutputLanguage(language);
      clearTranslationOutput();
      closeLanguageSelector({ restoreFocus: true });
    },
    [clearTranslationOutput, closeLanguageSelector, setOutputLanguage],
  );

  const handleLanguageSelectorClose = useCallback((): void => {
    closeLanguageSelector({ restoreFocus: true });
  }, [closeLanguageSelector]);

  return {
    inputText,
    isAuthenticated: Boolean(userId),
    isLanguageSelectorOpen,
    isSigningIn,
    isTranslating,
    languageArr,
    languageButtonRef,
    languageSelectorRef,
    originalLanguageName,
    outputLanguage,
    outputLanguageSelectorId,
    handleInputTextChange,
    handleLanguageSelect,
    handleLanguageSelectorClose,
    handleLanguageSelectorToggle,
    handlePrimaryActionClick,
  };
};
