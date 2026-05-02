export type TargetLanguage = 'cpp' | 'python'

export type CompileOptions = {
  targetLanguage: TargetLanguage
  writeToDisk?: boolean
  outputDir?: string
  namespaceAsDirs?: boolean
}

export type GeneratedFile = {
  path: string
  content: string
  className: string
}

export type CompilationIssue = {
  code: string
  message: string
  line?: number
}

export type CompileResult = {
  files: GeneratedFile[]
  warnings: CompilationIssue[]
  errors: CompilationIssue[]
  metadata: {
    classCount: number
    relationshipCount: number
    targetLanguage: TargetLanguage
    generatedAt: string
  }
}

export type ValidateResult = {
  warnings: CompilationIssue[]
  errors: CompilationIssue[]
}

export type Template = {
  id: string
  targetLanguage: string
  description: string
}

export type TemplatesResponse = {
  templates: Template[]
}

export type HealthResponse = {
  status: string
  service: string
  timestamp: string
}
