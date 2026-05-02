export type MmdFile = {
  id: string
  name: string
  source: string
}

export type CompileStatus = 'idle' | 'running' | 'done' | 'error'

/** One generated translation unit from compile (backend returns many). */
export type GeneratedCppFile = {
  path: string
  content: string
}

export type AiChatRole = 'user' | 'assistant' | 'system'

export type AiChatMessage = {
  id: string
  role: AiChatRole
  content: string
}

export type AppState = {
  files: MmdFile[]
  activeFileId: string | null
  renderError: string | null
  compileStatus: CompileStatus
}
