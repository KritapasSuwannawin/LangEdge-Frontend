import { toastError } from '@/shared/lib/toast';

type LogMetadataValue = boolean | number | string | null | undefined;

type LogMetadata = Record<string, LogMetadataValue>;

interface LogErrorWithToastOptions {
  readonly metadata?: LogMetadata;
  readonly toastMessage?: string | null;
}

const DEFAULT_ERROR_TOAST_MESSAGE = 'An error has occurred';

const formatMetadata = (metadata?: LogMetadata): string => {
  if (!metadata) {
    return '';
  }

  const sanitizedMetadata = Object.entries(metadata).reduce<Record<string, LogMetadataValue>>((accumulator, [key, value]) => {
    if (value !== undefined) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});

  if (Object.keys(sanitizedMetadata).length === 0) {
    return '';
  }

  return ` ${JSON.stringify(sanitizedMetadata)}`;
};

const formatLogMessage = (context: string, message: string, metadata?: LogMetadata): string => {
  return `${context}: ${message}${formatMetadata(metadata)}`;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
};

export const logInfo = (context: string, message: string, metadata?: LogMetadata): void => {
  console.info(formatLogMessage(context, message, metadata));
};

export const logWarn = (context: string, message: string, metadata?: LogMetadata): void => {
  console.warn(formatLogMessage(context, message, metadata));
};

export const logError = (context: string, error: unknown, metadata?: LogMetadata): void => {
  console.error(formatLogMessage(context, getErrorMessage(error), metadata));
};

export const logErrorWithToast = (context: string, error: unknown, options: LogErrorWithToastOptions = {}): void => {
  const { metadata, toastMessage = DEFAULT_ERROR_TOAST_MESSAGE } = options;

  logError(context, error, metadata);

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
