import type { AiChatMessage } from '../types'

/**
 * Wire these env vars when the backend exposes AI routes:
 *
 * - `VITE_AI_CHAT_URL` — POST JSON `{ messages, diagramSource? }` → `{ reply: string }`
 * - `VITE_AI_STREAM_URL` — optional SSE/stream endpoint (see `streamAgentChat`)
 * - `VITE_AI_UTILS_URL` — optional base for misc helpers (`explainDiagram`, etc.)
 *
 * Until then, all functions below are stubs (console + short delay).
 */

export function getAiChatEndpoint(): string | undefined {
  const url = import.meta.env.VITE_AI_CHAT_URL
  return typeof url === 'string' && url.length > 0 ? url : undefined
}

export function getAiStreamEndpoint(): string | undefined {
  const url = import.meta.env.VITE_AI_STREAM_URL
  return typeof url === 'string' && url.length > 0 ? url : undefined
}

export function getAiUtilsBaseUrl(): string | undefined {
  const url = import.meta.env.VITE_AI_UTILS_URL
  return typeof url === 'string' && url.length > 0 ? url : undefined
}

/** Main agent chat — replace body with `fetch(getAiChatEndpoint(), …)` when ready */
export async function sendAgentChatMessage(params: {
  messages: AiChatMessage[]
  diagramSource?: string
}): Promise<{ reply: string }> {
  const endpoint = getAiChatEndpoint()
  console.log('[stub] sendAgentChatMessage', {
    endpoint: endpoint ?? '(not set)',
    lastUser: params.messages.filter((m) => m.role === 'user').at(-1)?.content?.slice(0, 120),
  })

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: params.messages.map(({ role, content }) => ({ role, content })),
        diagramSource: params.diagramSource,
      }),
    })
    if (!res.ok) throw new Error(`AI chat failed: ${res.status}`)
    return res.json() as Promise<{ reply: string }>
  }

  await new Promise((r) => setTimeout(r, 450))
  return {
    reply:
      '*(stub)* Connect **`VITE_AI_CHAT_URL`** in `.env` and implement POST handling on the backend to get real answers.',
  }
}

/** Future streaming helper — throw until backend exposes SSE/chunk protocol */
export async function* streamAgentChat(_params: {
  messages: AiChatMessage[]
  diagramSource?: string
}): AsyncGenerator<string> {
  const endpoint = getAiStreamEndpoint()
  console.log('[stub] streamAgentChat — endpoint:', endpoint ?? '(not set)')
  throw new Error(
    'Streaming not wired yet. Set VITE_AI_STREAM_URL and implement this generator against your backend.'
  )
}

/** Optional utility: explain current diagram — POST to `${utils}/explain` or similar later */
export async function explainDiagram(diagramSource: string): Promise<{ explanation: string }> {
  const base = getAiUtilsBaseUrl()
  console.log('[stub] explainDiagram', base ?? '(VITE_AI_UTILS_URL not set)', diagramSource.slice(0, 80))

  if (base) {
    const res = await fetch(`${base.replace(/\/$/, '')}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diagramSource }),
    })
    if (!res.ok) throw new Error(`explainDiagram failed: ${res.status}`)
    return res.json() as Promise<{ explanation: string }>
  }

  await new Promise((r) => setTimeout(r, 300))
  return {
    explanation:
      '*(stub)* Set **`VITE_AI_UTILS_URL`** and implement `POST /explain` when your backend is ready.',
  }
}

/** Optional utility: suggestions / refactors — placeholder contract */
export async function suggestDiagramEdits(diagramSource: string): Promise<{ suggestions: string[] }> {
  const base = getAiUtilsBaseUrl()
  console.log('[stub] suggestDiagramEdits', base ?? '(not set)')

  if (base) {
    const res = await fetch(`${base.replace(/\/$/, '')}/suggest-edits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diagramSource }),
    })
    if (!res.ok) throw new Error(`suggestDiagramEdits failed: ${res.status}`)
    return res.json() as Promise<{ suggestions: string[] }>
  }

  await new Promise((r) => setTimeout(r, 300))
  return { suggestions: ['*(stub)* Hook `suggestDiagramEdits` to your backend when ready.'] }
}
