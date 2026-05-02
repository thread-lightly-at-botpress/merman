import { apiFetch } from './client'
import type { ValidateResult } from '../types/api'

export function validateMermaid(
  mermaid: string,
  signal?: AbortSignal
): Promise<ValidateResult> {
  return apiFetch<ValidateResult>('/validate', {
    method: 'POST',
    body: { mermaid },
    signal,
  })
}
