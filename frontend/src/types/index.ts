export type MmdFile = {
  id: string
  name: string
  source: string
}

export type CompileStatus = 'idle' | 'running' | 'done' | 'error'

export type AppState = {
  files: MmdFile[]
  activeFileId: string | null
  renderError: string | null
  compileStatus: CompileStatus
}
