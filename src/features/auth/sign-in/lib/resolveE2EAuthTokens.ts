interface E2EAuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

const E2E_AUTH_STORAGE_KEY = 'langedge:e2e-auth-tokens';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isE2EAuthEnabled = (): boolean => {
  return import.meta.env.VITE_E2E_AUTH === 'true';
};

export const resolveE2EAuthTokens = (): E2EAuthTokens | null => {
  if (!isE2EAuthEnabled() || typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(E2E_AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!isRecord(parsedValue)) {
      return null;
    }

    const { accessToken, refreshToken } = parsedValue;

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      return null;
    }

    return { accessToken, refreshToken };
  } catch {
    return null;
  }
};
