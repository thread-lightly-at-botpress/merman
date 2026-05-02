import { apiFetch } from './client'
import type { Template, TemplatesResponse } from '../types/api'

export async function getTemplates(signal?: AbortSignal): Promise<Template[]> {
  const data = await apiFetch<TemplatesResponse>('/templates', { signal })
  return data.templates
}
