import { Autonomous, z } from "@botpress/runtime"
import { parse } from "@a24z/mermaid-parser"

const cppTree = [
  "cpp-service/",
  "  CMakeLists.txt",
  "  README.md",
  "  include/",
  "    app/",
  "      App.hpp",
  "      Container.hpp",
  "      HttpServer.hpp",
  "  src/",
  "    main.cpp",
  "    app/",
  "      App.cpp",
  "      Container.cpp",
  "      HttpServer.cpp",
  "  tests/",
  "    App.test.cpp",
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default new Autonomous.Tool({
  name: "compileDiagram",
  description:
    "Compile validated Mermaid UML into a C++ boilerplate template. Use only after the user explicitly confirms they want to build.",
  input: z.object({
    mermaidCode: z
      .string()
      .describe("Validated Mermaid diagram source to compile into C++ boilerplate."),
    projectName: z
      .string()
      .default("cpp-service")
      .describe("Output project folder name to include in the generated archive."),
  }),
  output: z.object({
    zipUrl: z.string(),
    projectTree: z.array(z.string()),
    requestId: z.string(),
    compiledAt: z.string(),
    engine: z.string(),
  }),
  handler: async ({
    mermaidCode,
    projectName,
  }: {
    mermaidCode: string
    projectName: string
  }) => {
    const parseResult = await parse(mermaidCode)

    if (!parseResult.valid) {
      throw new Autonomous.ThinkSignal(
        "Invalid Mermaid syntax provided to compileDiagram.",
        `Regenerate Mermaid so it parses cleanly first. Parser error: ${parseResult.error ?? "unknown syntax error"}`
      )
    }

    await sleep(2000)

    const requestId = `mock_${Date.now()}`
    return {
      zipUrl: `https://mock-compiler.local/downloads/${encodeURIComponent(projectName)}-${requestId}.zip`,
      projectTree: cppTree.map((line) => line.replace("cpp-service", projectName)),
      requestId,
      compiledAt: new Date().toISOString(),
      engine: "mock-cpp-boilerplate-compiler:v1",
    }
  },
})
