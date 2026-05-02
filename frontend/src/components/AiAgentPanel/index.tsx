import { useCallback, useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AiChatMessage } from '../../types'
import { sendAgentChatMessage } from '../../api/ai'

type Props = {
  open: boolean
  onClose: () => void
  diagramSource: string
  messages: AiChatMessage[]
  onMessagesChange: (next: AiChatMessage[]) => void
}

export function AiAgentPanel({
  open,
  onClose,
  diagramSource,
  messages,
  onMessagesChange,
}: Props) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [open, messages])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSend = useCallback(async () => {
    const text = draft.trim()
    if (!text || sending) return

    const userMsg: AiChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }
    const history = [...messages, userMsg]
    onMessagesChange(history)
    setDraft('')
    setSending(true)

    try {
      const { reply } = await sendAgentChatMessage({
        messages: history,
        diagramSource: diagramSource,
      })
      onMessagesChange([
        ...history,
        { id: crypto.randomUUID(), role: 'assistant', content: reply },
      ])
    } catch (err) {
      console.error('[AiAgentPanel]', err)
      onMessagesChange([
        ...history,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Something went wrong talking to the AI service. Check the console and your **`VITE_AI_CHAT_URL`** configuration.',
        },
      ])
    } finally {
      setSending(false)
      window.setTimeout(onClose, 180)
    }
  }, [draft, sending, messages, diagramSource, onMessagesChange, onClose])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close AI assistant"
        className="fixed top-11 left-0 right-0 bottom-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className="fixed top-14 right-3 z-50 flex max-h-[min(520px,calc(100vh-4rem))] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-lg border border-orange-600/35 bg-zinc-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85),0_0_40px_-12px_rgba(249,115,22,0.25)]"
        role="dialog"
        aria-labelledby="ai-agent-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-orange-900/40 bg-orange-950/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-orange-400" aria-hidden />
            <h2 id="ai-agent-title" className="text-sm font-semibold tracking-tight text-orange-100">
              AI assistant
            </h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 shrink-0 p-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} />
          </Button>
        </div>

        <div
          ref={listRef}
          className="min-h-[140px] flex-1 overflow-y-auto px-3 py-3 font-mono text-xs leading-relaxed"
        >
          {messages.length === 0 ? (
            <p className="text-zinc-500">
              Ask about your diagram, codegen, or refactoring. This panel closes after you send a message (history is kept).
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`rounded-md px-2.5 py-2 ${
                    m.role === 'user'
                      ? 'ml-4 border border-orange-900/40 bg-orange-950/25 text-orange-50'
                      : 'mr-4 border border-zinc-700/80 bg-zinc-900/80 text-zinc-300'
                  }`}
                >
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-zinc-500">
                    {m.role}
                  </span>
                  <span className="whitespace-pre-wrap">{m.content}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-orange-900/40 p-2">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              placeholder="Message…"
              value={draft}
              disabled={sending}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
              className="min-h-[44px] flex-1 resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 disabled:opacity-50"
            />
            <Button
              size="sm"
              className="h-auto shrink-0 self-end bg-orange-500 px-3 text-zinc-950 hover:bg-orange-400 disabled:opacity-50"
              onClick={() => void handleSend()}
              disabled={sending || !draft.trim()}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </Button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] text-zinc-600">
            Stub mode unless <span className="text-orange-500/90">VITE_AI_CHAT_URL</span> is set.
          </p>
        </div>
      </div>
    </>
  )
}
