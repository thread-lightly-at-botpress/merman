import { randomUUID } from "node:crypto";
import { CompileResult, GeneratedFile } from "./types.js";

export interface CompileSession {
  id: string;
  createdAt: string;
  expiresAt: number;
  result: CompileResult;
}

const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1h

export class SessionStore {
  private sessions = new Map<string, CompileSession>();

  constructor(private ttlMs: number = DEFAULT_TTL_MS) {}

  put(result: CompileResult): CompileSession {
    this.sweep();
    const id = randomUUID();
    const session: CompileSession = {
      id,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + this.ttlMs,
      result,
    };
    this.sessions.set(id, session);
    return session;
  }

  get(id: string): CompileSession | undefined {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(id);
      return undefined;
    }
    return session;
  }

  list(): CompileSession[] {
    this.sweep();
    return [...this.sessions.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  findFile(sessionId: string, path: string): GeneratedFile | undefined {
    const session = this.get(sessionId);
    if (!session) return undefined;
    return session.result.files.find((f) => f.path === path);
  }

  private sweep(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (session.expiresAt < now) {
        this.sessions.delete(id);
      }
    }
  }
}
