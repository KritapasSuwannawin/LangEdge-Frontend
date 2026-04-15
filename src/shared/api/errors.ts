interface ApiErrorDetails {
  readonly message: string;
  readonly status?: number;
  readonly data?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly data?: unknown;

  constructor(name: string, details: ApiErrorDetails) {
    super(details.message);

    this.name = name;
    this.status = details.status;
    this.data = details.data;
  }
}

export class ApiNetworkError extends ApiError {
  constructor(message = 'Network request failed') {
    super('ApiNetworkError', { message });
  }
}

export class ApiInvalidResponseError extends ApiError {
  constructor(message = 'Invalid response format', status?: number, data?: unknown) {
    super('ApiInvalidResponseError', { message, status, data });
  }
}

export class ApiResponseError extends ApiError {
  constructor(message: string, status: number, data?: unknown) {
    super('ApiResponseError', { message, status, data });
  }
}

export class ApiUnauthorizedError extends ApiResponseError {
  constructor(message = 'Unauthorized', status = 401, data?: unknown) {
    super(message, status, data);
    this.name = 'ApiUnauthorizedError';
  }
}

export class ApiRateLimitError extends ApiResponseError {
  constructor(message = 'Too many requests', status = 429, data?: unknown) {
    super(message, status, data);
    this.name = 'ApiRateLimitError';
  }
}
