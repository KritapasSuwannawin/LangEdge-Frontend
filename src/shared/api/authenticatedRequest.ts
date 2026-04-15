import zod from 'zod';

import { getToken, setToken } from '@/shared/lib';

import { ApiInvalidResponseError, ApiUnauthorizedError } from './errors';
import { requestJson, type JsonResponse, type RequestJsonOptions } from './httpClient';

const refreshTokenResponseSchema = zod.object({
  accessToken: zod.string(),
  refreshToken: zod.string(),
});

interface AuthTokens {
  readonly accessToken?: string;
  readonly refreshToken?: string;
}

interface RefreshTokenData {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface RequestWithAuthOptions extends RequestJsonOptions {
  readonly accessToken?: string;
  readonly refreshToken?: string;
}

const resolveAuthTokens = (options: RequestWithAuthOptions): AuthTokens => {
  return {
    accessToken: options.accessToken ?? getToken('accessToken') ?? undefined,
    refreshToken: options.refreshToken ?? getToken('refreshToken') ?? undefined,
  };
};

const buildAuthHeaders = (headers?: HeadersInit, accessToken?: string): Headers => {
  const requestHeaders = new Headers(headers);

  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  } else {
    requestHeaders.delete('Authorization');
  }

  return requestHeaders;
};

const persistTokens = (tokens: AuthTokens): void => {
  if (!tokens.accessToken || !tokens.refreshToken) {
    return;
  }

  setToken('accessToken', tokens.accessToken);
  setToken('refreshToken', tokens.refreshToken);
};

const toRequestJsonOptions = (options: RequestWithAuthOptions, accessToken?: string): RequestJsonOptions => {
  return {
    path: options.path,
    method: options.method,
    body: options.body,
    signal: options.signal,
    headers: buildAuthHeaders(options.headers, accessToken),
  };
};

const requestWithToken = async <TData>(options: RequestWithAuthOptions, accessToken?: string): Promise<JsonResponse<TData>> => {
  return await requestJson<TData>(toRequestJsonOptions(options, accessToken));
};

const parseRefreshTokenData = (data: unknown, status: number): RefreshTokenData => {
  const parsedData = refreshTokenResponseSchema.safeParse(data);

  if (!parsedData.success) {
    throw new ApiInvalidResponseError('Invalid refresh token response', status, data);
  }

  return parsedData.data;
};

const toUnauthorizedError = (error: unknown): ApiUnauthorizedError => {
  if (error instanceof ApiUnauthorizedError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiUnauthorizedError(error.message);
  }

  return new ApiUnauthorizedError();
};

const refreshTokens = async (refreshToken: string): Promise<RefreshTokenData> => {
  try {
    const response = await requestJson<unknown>({
      path: '/api/auth/token/refresh',
      method: 'POST',
      body: { refreshToken },
    });

    return parseRefreshTokenData(response.data, response.status);
  } catch (error) {
    throw toUnauthorizedError(error);
  }
};

export async function requestWithAuth<TData = unknown>(options: RequestWithAuthOptions): Promise<JsonResponse<TData>> {
  const tokens = resolveAuthTokens(options);

  try {
    const response = await requestWithToken<TData>(options, tokens.accessToken);

    persistTokens(tokens);
    return response;
  } catch (error) {
    if (!(error instanceof ApiUnauthorizedError) || !tokens.refreshToken) {
      throw error;
    }
  }

  const refreshedTokens = await refreshTokens(tokens.refreshToken);
  const response = await requestWithToken<TData>(options, refreshedTokens.accessToken);

  persistTokens(refreshedTokens);
  return response;
}
