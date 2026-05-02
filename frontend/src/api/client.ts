const RAW_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'
export const API_BASE_URL = RAW_BASE.endsWith('/')
  ? RAW_BASE.slice(0, -1)
  : RAW_BASE

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type ApiFetchOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  signal?: AbortSignal
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, signal } = options
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    throw new ApiError(0, (err as Error).message || 'Network error', null)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload: unknown = isJson ? await response.json() : await response.text()

  // The backend returns 422 for validation/compilation errors with a structured
  // payload that callers want to inspect, so surface that body to the caller.
  if (!response.ok && response.status !== 422) {
    const message =
      isJson && payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `Request to ${path} failed with status ${response.status}`
    throw new ApiError(response.status, message, payload)
  }

  return payload as T
}
