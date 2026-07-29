import { getApiUrl } from '../config/api';

const TOKEN_STORAGE_KEY = 'admin_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

/** Thin fetch wrapper: attaches the Bearer token, unwraps JSON, and normalizes API errors. */
export async function apiRequest<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  let finalBody: BodyInit | undefined;
  if (body instanceof FormData) {
    finalBody = body;
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }
    throw new ApiError(
      payload?.message || `Request failed with status ${response.status}`,
      response.status,
      payload?.errors
    );
  }

  // A 2xx response without a JSON body is not a valid success response for this API
  // (every endpoint here returns JSON) - treating it as `null` would silently report
  // success to the caller for what is actually a broken/misconfigured server response.
  if (!isJson) {
    throw new ApiError(`Unexpected non-JSON response (status ${response.status})`, response.status);
  }

  return payload as T;
}
