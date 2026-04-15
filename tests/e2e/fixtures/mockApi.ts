import { type Page, type Route } from '@playwright/test';

import { DEFAULT_LANGUAGES, DEFAULT_AUTH_TOKENS, MANUAL_SIGN_IN_USER } from './testData';

const BACKEND_API_URL = 'http://127.0.0.1:4010/api/**';

export interface RecordedRequest {
  readonly authorization?: string;
  readonly body: unknown;
  readonly method: string;
  readonly pathname: string;
  readonly searchParams: URLSearchParams;
}

export interface MockJsonResponse {
  readonly status: number;
  readonly data?: unknown;
  readonly message?: string;
  readonly gate?: Promise<void>;
}

const DEFAULT_ERROR_MESSAGE = 'Unknown error';
const DEFAULT_SUCCESS_MESSAGE = 'Success';

const createSuccessResponse = (data?: unknown, gate?: Promise<void>): MockJsonResponse => {
  return { status: 200, data, gate };
};

const parseBody = (route: Route): unknown => {
  const requestBody = route.request().postData();

  if (!requestBody) {
    return undefined;
  }

  try {
    return JSON.parse(requestBody) as unknown;
  } catch {
    return requestBody;
  }
};

const toRecordedRequest = (route: Route): RecordedRequest => {
  const request = route.request();
  const requestUrl = new URL(request.url());

  return {
    authorization: request.headers().authorization,
    body: parseBody(route),
    method: request.method(),
    pathname: requestUrl.pathname,
    searchParams: requestUrl.searchParams,
  };
};

const toResponseBody = (response: MockJsonResponse): string => {
  const defaultMessage = response.status >= 400 ? DEFAULT_ERROR_MESSAGE : DEFAULT_SUCCESS_MESSAGE;

  return JSON.stringify({ data: response.data, message: response.message ?? defaultMessage });
};

const fulfillResponse = async (route: Route, response: MockJsonResponse): Promise<void> => {
  if (response.gate) {
    await response.gate;
  }

  await route.fulfill({
    status: response.status,
    contentType: 'application/json',
    body: toResponseBody(response),
  });
};

const unexpectedRequestResponse = (request: RecordedRequest): MockJsonResponse => {
  return {
    status: 500,
    message: `Unexpected request: ${request.method} ${request.pathname}`,
  };
};

export const createMockResponse = (
  options: {
    readonly data?: unknown;
    readonly gate?: Promise<void>;
    readonly message?: string;
    readonly status?: number;
  } = {},
): MockJsonResponse => {
  return {
    status: options.status ?? 200,
    data: options.data,
    gate: options.gate,
    message: options.message,
  };
};

export class LangEdgeApiMock {
  private languageResponse: MockJsonResponse = createSuccessResponse({ languageArr: DEFAULT_LANGUAGES });
  private signInResponse: MockJsonResponse = createSuccessResponse(MANUAL_SIGN_IN_USER);
  private refreshResponse: MockJsonResponse = createSuccessResponse(DEFAULT_AUTH_TOKENS);
  private updateUserResponse: MockJsonResponse = createSuccessResponse();
  private readonly recordedRequests: RecordedRequest[] = [];
  private readonly translationResponses: MockJsonResponse[] = [];

  constructor(private readonly page: Page) {}

  async install(): Promise<void> {
    await this.page.route(BACKEND_API_URL, async (route) => {
      const request = toRecordedRequest(route);

      this.recordedRequests.push(request);

      await fulfillResponse(route, this.resolveResponse(request));
    });
  }

  getRequests(pathname: string, method?: string): RecordedRequest[] {
    return this.recordedRequests.filter((request) => {
      return request.pathname === pathname && (!method || request.method === method);
    });
  }

  queueTranslationResponse(response: MockJsonResponse): void {
    this.translationResponses.push(response);
  }

  useLanguageResponse(response: MockJsonResponse): void {
    this.languageResponse = response;
  }

  useRefreshResponse(response: MockJsonResponse): void {
    this.refreshResponse = response;
  }

  useSignInResponse(response: MockJsonResponse): void {
    this.signInResponse = response;
  }

  useUpdateUserResponse(response: MockJsonResponse): void {
    this.updateUserResponse = response;
  }

  private resolveResponse(request: RecordedRequest): MockJsonResponse {
    if (request.pathname === '/api/translation') {
      return this.resolveTranslationResponse(request);
    }

    switch (`${request.method} ${request.pathname}`) {
      case 'GET /api/language':
        return this.languageResponse;
      case 'POST /api/user/sign-in':
        return this.signInResponse;
      case 'POST /api/auth/token/refresh':
        return this.refreshResponse;
      case 'PATCH /api/user':
        return this.updateUserResponse;
      default:
        return unexpectedRequestResponse(request);
    }
  }

  private resolveTranslationResponse(request: RecordedRequest): MockJsonResponse {
    const nextResponse = this.translationResponses.shift();

    return nextResponse ?? unexpectedRequestResponse(request);
  }
}
