import express from "express";
import { z } from "zod";
import { CompilationService } from "./service.js";
import { SessionStore } from "./store.js";
import { createExplorerRouter } from "./explorer.js";

const compileRequestSchema = z.object({
  mermaid: z.string().min(1),
  options: z
    .object({
      targetLanguage: z.enum(["cpp", "python"]).default("cpp"),
      writeToDisk: z.boolean().default(false),
      outputDir: z.string().optional(),
      namespaceAsDirs: z.boolean().default(true),
    })
    .default({ targetLanguage: "cpp", writeToDisk: false, namespaceAsDirs: true }),
});

const validateRequestSchema = z.object({
  mermaid: z.string().min(1),
});

export function createApiApp(
  service = new CompilationService(),
  store = new SessionStore()
) {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "merman-compiler", timestamp: new Date().toISOString() });
  });

  app.use(createExplorerRouter(store));

  app.get("/templates", (_req, res) => {
    res.json({ templates: service.templates() });
  });

  app.post("/validate", async (req, res) => {
    const parsed = validateRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((i) => ({ code: "SCHEMA_ERROR", message: `${i.path.join(".")}: ${i.message}` })),
      });
    }
    const result = await service.validate(parsed.data.mermaid);
    return res.status(result.errors.length ? 422 : 200).json(result);
  });

  app.post("/compile", async (req, res) => {
    const parsed = compileRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((i) => ({ code: "SCHEMA_ERROR", message: `${i.path.join(".")}: ${i.message}` })),
      });
    }
    const result = await service.compile(parsed.data.mermaid, parsed.data.options);
    if (result.errors.length === 0 && result.files.length > 0) {
      const session = store.put(result);
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      return res.status(200).json({
        ...result,
        sessionId: session.id,
        explorerUrl: `${baseUrl}/explorer/${session.id}`,
      });
    }
    return res.status(result.errors.length ? 422 : 200).json(result);
  });

  return app;
}
