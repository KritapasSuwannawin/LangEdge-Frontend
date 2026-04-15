import { ApiInvalidResponseError, ApiNetworkError, ApiRateLimitError, ApiResponseError, ApiUnauthorizedError } from '@/shared/api/errors';

const DEFAULT_ERROR_MESSAGE = 'Unknown error';
const DEFAULT_SUCCESS_MESSAGE = 'Success';

export interface RequestJsonOptions {
  readonly path: string;
  readonly method?: string;
  readonly body?: unknown;
  readonly signal?: AbortSignal;
  readonly headers?: HeadersInit;
}

export interface JsonResponse<TData = unknown> {
  readonly data?: TData;
  readonly message: string;
  readonly status: number;
}

interface ResponsePayload<TData = unknown> {
  readonly data?: TData;
  readonly message?: string;
}

const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL as string;
};

const buildRequestHeaders = (headers?: HeadersInit, body?: unknown): Headers => {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type') && body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return requestHeaders;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const responseText = await response.text();

  if (!responseText) {
    return undefined;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    throw new ApiInvalidResponseError('Invalid response format', response.status);
  }
};

const getResponsePayload = <TData>(body: unknown): ResponsePayload<TData> => {
  if (typeof body !== 'object' || body === null) {
    return {};
  }

  const payload = body as Record<string, unknown>;

  return {
    data: payload.data as TData | undefined,
    message: typeof payload.message === 'string' ? payload.message : undefined,
  };
};

const getResponseMessage = (response: Response, message?: string): string => {
  if (message) {
    return message;
  }

  return response.ok ? DEFAULT_SUCCESS_MESSAGE : DEFAULT_ERROR_MESSAGE;
};

const createResponseError = (response: Response, message: string, data?: unknown): ApiResponseError => {
  if (response.status === 401) {
    return new ApiUnauthorizedError(message, response.status, data);
  }

  if (response.status === 429) {
    return new ApiRateLimitError(message, response.status, data);
  }

  return new ApiResponseError(message, response.status, data);
};

export async function requestJson<TData = unknown>(options: RequestJsonOptions): Promise<JsonResponse<TData>> {
  const { path, method = 'GET', body, signal, headers } = options;

  let response: Response;

  try {
    response = await fetch(`${getBackendUrl()}${path}`, {
      method,
      headers: buildRequestHeaders(headers, body),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    throw new ApiNetworkError(error instanceof Error ? error.message : 'Network request failed');
  }

  const responseBody = await parseResponseBody(response);
  const { data, message } = getResponsePayload<TData>(responseBody);
  const responseMessage = getResponseMessage(response, message);

  if (!response.ok) {
    throw createResponseError(response, responseMessage, data);
  }

  return {
    data,
    message: responseMessage,
    status: response.status,
  };
}
