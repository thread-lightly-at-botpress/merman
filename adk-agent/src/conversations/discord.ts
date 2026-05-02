import { Autonomous, Conversation, z } from "@botpress/runtime"
import { parse } from "@a24z/mermaid-parser"
import compileDiagram from "../tools/compileDiagram.js"

const conversationState = z.object({
  status: z.enum(["idle", "pending_approval", "ready_to_build"]).default("idle"),
  pendingMermaid: z.string().default(""),
  lastValidationError: z.string().nullable().default(null),
  lastUserSpec: z.string().nullable().default(null),
})

const isAffirmative = (text: string): boolean =>
  /^(yes|y|ok|okay|sure|confirm|approved|approve|build|compile|go ahead|proceed)\b/i.test(
    text.trim()
  )

const isNegative = (text: string): boolean =>
  /^(no|n|reject|revise|regenerate|change|edit|not yet|cancel)\b/i.test(text.trim())

const readMessageText = (message: unknown): string => {
  if (!message || typeof message !== "object") return ""
  const payload = (message as { payload?: unknown }).payload
  if (!payload || typeof payload !== "object") return ""
  const maybeText = (payload as { text?: unknown }).text
  return typeof maybeText === "string" ? maybeText.trim() : ""
}

export default new Conversation({
  channel: "discord.channel",
  state: conversationState,
  handler: async (props: any) => {
    if (props.type !== "message") return

    const userText = readMessageText(props.message)
    if (!userText) return
    props.state.lastUserSpec = userText

    if (props.state.status === "pending_approval") {
      if (isAffirmative(userText)) {
        if (!props.state.pendingMermaid) {
          props.state.status = "idle"
          await props.conversation.send("text", {
            text: "I lost the pending diagram state. Please describe the system again so I can regenerate it.",
          })
          return
        }

        props.state.status = "ready_to_build"

        const compileResult = await props.execute({
          mode: "chat",
          instructions: `The user approved the UML and asked to compile now.
Call the compileDiagram tool exactly once using the Mermaid code below.

Mermaid:
${props.state.pendingMermaid}`,
          tools: [compileDiagram],
        })

        if (!compileResult.isSuccess() || !compileResult.output) {
          props.state.status = "pending_approval"
          await props.conversation.send("text", {
            text: "Compilation could not be completed yet. Please confirm again and I will retry.",
          })
          return
        }

        const output = compileResult.output as {
          zipUrl: string
          projectTree: string[]
          requestId: string
          compiledAt: string
          engine: string
        }

        await props.conversation.send("text", {
          text: [
            "Build complete (mock compiler).",
            `Request: ${output.requestId}`,
            `Engine: ${output.engine}`,
            `Compiled At: ${output.compiledAt}`,
            `ZIP: ${output.zipUrl}`,
            "",
            "```text",
            ...output.projectTree,
            "```",
          ].join("\n"),
        })

        props.state.status = "idle"
        props.state.pendingMermaid = ""
        props.state.lastValidationError = null
        return
      }

      if (isNegative(userText)) {
        props.state.status = "idle"
        props.state.pendingMermaid = ""
      }
    }

    let candidateMermaid = ""

    const submitMermaidCandidate = new Autonomous.Tool({
      name: "submitMermaidCandidate",
      description:
        "Submit a Mermaid diagram candidate for parser validation. Use this after analyzing the user's system description.",
      input: z.object({
        mermaidCode: z
          .string()
          .describe("Mermaid diagram source code only, without markdown fences."),
      }),
      output: z.object({
        accepted: z.literal(true),
        diagramType: z.string(),
      }),
      handler: async ({ mermaidCode }: { mermaidCode: string }) => {
        const parsed = await parse(mermaidCode)
        if (!parsed.valid) {
          props.state.lastValidationError = parsed.error ?? "Unknown Mermaid parser error."
          throw new Autonomous.ThinkSignal(
            "Generated Mermaid failed parser validation.",
            `Silently regenerate syntactically valid Mermaid and call submitMermaidCandidate again. Parser error: ${props.state.lastValidationError}`
          )
        }

        candidateMermaid = mermaidCode
        props.state.lastValidationError = null
        return { accepted: true, diagramType: parsed.type }
      },
    })

    await props.execute({
      mode: "chat",
      instructions: `You are a UML architect generating Mermaid from the latest user request.

Rules:
1) Generate Mermaid that matches the user's requested system.
2) Do not ask the user to fix syntax errors.
3) Call submitMermaidCandidate with Mermaid source.
4) If the tool rejects syntax, silently fix Mermaid and retry.
5) Do not call compileDiagram until user explicitly confirms.`,
      tools: [submitMermaidCandidate, compileDiagram],
    })

    if (!candidateMermaid) {
      await props.conversation.send("text", {
        text: "I couldn't produce a valid Mermaid diagram yet. Please restate the system in one or two sentences and I'll retry.",
      })
      return
    }

    props.state.pendingMermaid = candidateMermaid
    props.state.status = "pending_approval"

    await props.conversation.send("text", {
      text: [
        "I generated a validated Mermaid diagram. Please confirm before I compile it.",
        "",
        "```mermaid",
        candidateMermaid,
        "```",
        "",
        'Reply with "yes" to compile, or "revise" to regenerate.',
      ].join("\n"),
    })
  },
})
