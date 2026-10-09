import { appConfig } from '../config/appConfig';
import type { ApiError } from '../types';

export class ApiClientError extends Error {
  status?: number;
  details?: unknown;
  constructor(payload: ApiError) {
    super(payload.message);
    this.name = 'ApiClientError';
    this.status = payload.status;
    this.details = payload.details;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, signal?: AbortSignal): Promise<T> {
  const controller = signal ? undefined : new AbortController();
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    signal: signal ?? controller?.signal,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init.headers },
  });
  const contentType = response.headers.get('content-type') ?? '';
  const payload: unknown = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string'
      ? payload.message : `Request failed with status ${response.status}`;
    throw new ApiClientError({ message, status: response.status, details: payload });
  }
  return payload as T;
}
