import { toastError } from './toastUtility';

export const logError = (location: string, err: unknown, toastMessage: string | null = 'An error has occurred'): void => {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  console.error(`${location}:`, errorMessage);

  if (toastMessage) {
    toastError(toastMessage);
  }
};

export const isDefined = (value: unknown, isAllowNull = true): boolean => {
  if (value === undefined) {
    return false;
  }

  if (!isAllowNull && value === null) {
    return false;
  }

  return true;
};
