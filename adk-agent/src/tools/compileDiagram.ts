import { Autonomous, z } from "@botpress/runtime"

const COMPILER_API_URL = process.env.COMPILER_API_URL ?? "http://localhost:8080"

type CompileApiResponse = {
  files: { path: string; content: string; className: string }[]
  warnings: { code: string; message: string }[]
  errors: { code: string; message: string }[]
  metadata: {
    classCount: number
    relationshipCount: number
    targetLanguage: "cpp" | "python"
    generatedAt: string
  }
  sessionId?: string
  explorerUrl?: string
}

export default new Autonomous.Tool({
  name: "compileDiagram",
  description:
    "Compile validated Mermaid UML into C++ boilerplate and produce a browsable file explorer URL. Use only after the user explicitly confirms they want to build.",
  input: z.object({
    mermaidCode: z
      .string()
      .describe("Mermaid class-diagram source to compile."),
    targetLanguage: z
      .enum(["cpp", "python"])
      .default("cpp")
      .describe("Target output language for the generated boilerplate."),
  }),
  output: z.object({
    explorerUrl: z.string(),
    sessionId: z.string(),
    fileCount: z.number(),
    projectTree: z.array(z.string()),
    classCount: z.number(),
    compiledAt: z.string(),
    engine: z.string(),
  }),
  handler: async ({
    mermaidCode,
    targetLanguage,
  }: {
    mermaidCode: string
    targetLanguage: "cpp" | "python"
  }) => {
    let res: Response
    try {
      res = await fetch(`${COMPILER_API_URL}/compile`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mermaid: mermaidCode,
          options: { targetLanguage, writeToDisk: false, namespaceAsDirs: true },
        }),
      })
    } catch (err) {
      throw new Autonomous.ThinkSignal(
        "Compiler API is unreachable.",
        `Could not reach the merman compiler at ${COMPILER_API_URL}. Make sure it is running (\`npm run dev\` in merman_compiler) and retry. Underlying error: ${(err as Error).message}`
      )
    }

    const data = (await res.json()) as CompileApiResponse

    if (res.status !== 200 || data.errors.length > 0) {
      const issues = data.errors.map((e) => `${e.code}: ${e.message}`).join("; ")
      throw new Autonomous.ThinkSignal(
        "The Mermaid diagram failed to compile.",
        `Fix the diagram before retrying. Compiler errors: ${issues || `HTTP ${res.status}`}`
      )
    }

    if (!data.sessionId || !data.explorerUrl) {
      throw new Autonomous.ThinkSignal(
        "Compiler returned no explorer session.",
        "The compiler API succeeded but did not return a sessionId/explorerUrl. The compiler service may be out of date; restart it and retry."
      )
    }

    return {
      explorerUrl: data.explorerUrl,
      sessionId: data.sessionId,
      fileCount: data.files.length,
      projectTree: data.files.map((f) => f.path).sort(),
      classCount: data.metadata.classCount,
      compiledAt: data.metadata.generatedAt,
      engine: `merman-compiler:${targetLanguage}`,
    }
  },
})
