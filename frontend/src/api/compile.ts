import { apiFetch } from './client'
import type { CompileOptions, CompileResult } from '../types/api'

export function compileMermaid(
  mermaid: string,
  options?: Partial<CompileOptions>,
  signal?: AbortSignal
): Promise<CompileResult> {
  const body: { mermaid: string; options?: Partial<CompileOptions> } = { mermaid }
  if (options) body.options = options

  return apiFetch<CompileResult>('/compile', {
    method: 'POST',
    body,
    signal,
  })
}
