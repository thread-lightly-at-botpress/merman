import { Router } from "express";
import { SessionStore } from "./store.js";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderIndexPage = (sessions: ReturnType<SessionStore["list"]>) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Merman Compiler · Sessions</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>${BASE_CSS}</style>
</head>
<body>
  <header><h1>Merman Compiler</h1><span class="muted">Compiled sessions</span></header>
  <main class="single">
    ${
      sessions.length === 0
        ? `<p class="empty">No sessions yet. POST to <code>/compile</code> to create one.</p>`
        : `<table class="sessions">
            <thead><tr><th>Session</th><th>Created</th><th>Files</th><th>Target</th><th></th></tr></thead>
            <tbody>${sessions
              .map(
                (s) => `<tr>
                  <td><code>${s.id}</code></td>
                  <td>${escapeHtml(s.createdAt)}</td>
                  <td>${s.result.files.length}</td>
                  <td>${s.result.metadata.targetLanguage}</td>
                  <td><a href="/explorer/${s.id}">Open →</a></td>
                </tr>`
              )
              .join("")}</tbody>
          </table>`
    }
  </main>
</body>
</html>`;

const renderSessionPage = (session: ReturnType<SessionStore["get"]> & object) => {
  const files = session.result.files;
  const tree = buildTree(files.map((f) => f.path));
  const filesJson = JSON.stringify(
    files.map((f) => ({ path: f.path, content: f.content, className: f.className }))
  );
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Merman Explorer · ${session.id.slice(0, 8)}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css" />
  <style>${BASE_CSS}${EXPLORER_CSS}</style>
</head>
<body>
  <header>
    <h1>Merman Compiler</h1>
    <span class="muted">session <code>${session.id.slice(0, 8)}</code> · ${
      files.length
    } files · ${session.result.metadata.targetLanguage}</span>
    <span class="spacer"></span>
    <a class="btn" href="/explorer">All sessions</a>
    <button class="btn" id="downloadAll">Download all</button>
  </header>
  <main class="split">
    <aside class="tree">
      ${renderTreeHtml(tree, "")}
    </aside>
    <section class="viewer">
      <div class="toolbar">
        <span id="currentPath" class="path">Pick a file</span>
        <span class="spacer"></span>
        <button class="btn" id="copyBtn" disabled>Copy</button>
        <a class="btn" id="rawBtn" href="#" target="_blank" rel="noopener" hidden>Raw</a>
      </div>
      <pre><code id="codeView" class="hljs">// Select a file from the tree</code></pre>
    </section>
  </main>
  <script id="filesData" type="application/json">${filesJson.replace(/</g, "\\u003c")}</script>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/cpp.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/python.min.js"></script>
  <script>
    const sessionId = ${JSON.stringify(session.id)};
    const files = JSON.parse(document.getElementById("filesData").textContent);
    const byPath = new Map(files.map((f) => [f.path, f]));
    const codeView = document.getElementById("codeView");
    const currentPath = document.getElementById("currentPath");
    const copyBtn = document.getElementById("copyBtn");
    const rawBtn = document.getElementById("rawBtn");
    let active = null;

    function languageFor(path) {
      if (path.endsWith(".hpp") || path.endsWith(".cpp") || path.endsWith(".h") || path.endsWith(".cc")) return "cpp";
      if (path.endsWith(".py")) return "python";
      return "plaintext";
    }

    function selectFile(path) {
      const file = byPath.get(path);
      if (!file) return;
      currentPath.textContent = path;
      codeView.className = "hljs language-" + languageFor(path);
      codeView.textContent = file.content;
      if (window.hljs) window.hljs.highlightElement(codeView);
      copyBtn.disabled = false;
      rawBtn.hidden = false;
      rawBtn.href = "/sessions/" + sessionId + "/files/" + encodeURI(path);
      document.querySelectorAll(".tree .file.active").forEach((el) => el.classList.remove("active"));
      const node = document.querySelector('.tree .file[data-path="' + CSS.escape(path) + '"]');
      if (node) node.classList.add("active");
      active = path;
    }

    document.querySelectorAll(".tree .file").forEach((el) => {
      el.addEventListener("click", () => selectFile(el.dataset.path));
    });
    document.querySelectorAll(".tree .dir > .label").forEach((el) => {
      el.addEventListener("click", () => el.parentElement.classList.toggle("collapsed"));
    });

    copyBtn.addEventListener("click", async () => {
      if (!active) return;
      const file = byPath.get(active);
      await navigator.clipboard.writeText(file.content);
      copyBtn.textContent = "Copied";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
    });

    document.getElementById("downloadAll").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(files, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merman-" + sessionId.slice(0, 8) + ".json";
      a.click();
      URL.revokeObjectURL(url);
    });

    if (files.length > 0) selectFile(files[0].path);
  </script>
</body>
</html>`;
};

interface TreeNode {
  name: string;
  fullPath: string;
  isFile: boolean;
  children: Map<string, TreeNode>;
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "", fullPath: "", isFile: false, children: new Map() };
  for (const path of paths) {
    const segments = path.split("/").filter(Boolean);
    let node = root;
    segments.forEach((seg, i) => {
      const isLast = i === segments.length - 1;
      if (!node.children.has(seg)) {
        node.children.set(seg, {
          name: seg,
          fullPath: segments.slice(0, i + 1).join("/"),
          isFile: isLast,
          children: new Map(),
        });
      }
      node = node.children.get(seg)!;
    });
  }
  return root;
}

function renderTreeHtml(node: TreeNode, _indent: string): string {
  const entries = [...node.children.values()].sort((a, b) => {
    if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  const items = entries
    .map((child) => {
      if (child.isFile) {
        return `<div class="file" data-path="${escapeHtml(child.fullPath)}" title="${escapeHtml(
          child.fullPath
        )}"><span class="icon">▪</span>${escapeHtml(child.name)}</div>`;
      }
      return `<div class="dir"><div class="label"><span class="icon">▾</span>${escapeHtml(
        child.name
      )}</div><div class="children">${renderTreeHtml(child, "")}</div></div>`;
    })
    .join("");
  return items;
}

const BASE_CSS = `
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;padding:0;height:100%}
  body{font:14px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0d1117;color:#c9d1d9}
  header{display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;background:#161b22;border-bottom:1px solid #30363d;position:sticky;top:0;z-index:10}
  header h1{margin:0;font-size:1rem;font-weight:600}
  header .muted{color:#8b949e;font-size:.85rem}
  header .spacer{flex:1}
  main{padding:1rem}
  main.single{max-width:960px;margin:0 auto}
  code{font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#161b22;padding:.1rem .3rem;border-radius:3px}
  a{color:#58a6ff;text-decoration:none}
  a:hover{text-decoration:underline}
  .btn{display:inline-flex;align-items:center;padding:.35rem .75rem;font:inherit;color:#c9d1d9;background:#21262d;border:1px solid #30363d;border-radius:6px;cursor:pointer}
  .btn:hover:not(:disabled){background:#30363d}
  .btn:disabled{opacity:.5;cursor:not-allowed}
  .empty{color:#8b949e;text-align:center;padding:3rem 0}
  table.sessions{width:100%;border-collapse:collapse}
  table.sessions th,table.sessions td{padding:.5rem .75rem;border-bottom:1px solid #21262d;text-align:left}
  table.sessions th{color:#8b949e;font-weight:500;font-size:.85rem}
`;

const EXPLORER_CSS = `
  main.split{display:grid;grid-template-columns:280px 1fr;gap:1rem;padding:1rem;height:calc(100vh - 56px)}
  .tree{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:.5rem;overflow:auto}
  .tree .file,.tree .dir>.label{display:flex;align-items:center;gap:.4rem;padding:.25rem .5rem;border-radius:4px;cursor:pointer;user-select:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tree .file:hover,.tree .dir>.label:hover{background:#21262d}
  .tree .file.active{background:#1f6feb33;color:#fff}
  .tree .icon{color:#8b949e;font-size:.8rem;width:.9rem;display:inline-block;text-align:center}
  .tree .file .icon{color:#58a6ff}
  .tree .dir>.children{margin-left:.85rem;border-left:1px solid #21262d;padding-left:.25rem}
  .tree .dir.collapsed>.children{display:none}
  .tree .dir.collapsed>.label .icon{transform:rotate(-90deg)}
  .viewer{display:flex;flex-direction:column;background:#161b22;border:1px solid #30363d;border-radius:8px;overflow:hidden}
  .viewer .toolbar{display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border-bottom:1px solid #30363d;background:#0d1117}
  .viewer .toolbar .spacer{flex:1}
  .viewer .path{font:13px/1 ui-monospace,monospace;color:#8b949e}
  .viewer pre{margin:0;flex:1;overflow:auto;padding:0}
  .viewer pre code{display:block;padding:1rem;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:transparent;border-radius:0;white-space:pre;tab-size:2}
`;

export function createExplorerRouter(store: SessionStore): Router {
  const router = Router();

  router.get("/explorer", (_req, res) => {
    res.type("html").send(renderIndexPage(store.list()));
  });

  router.get("/explorer/:id", (req, res) => {
    const session = store.get(req.params.id);
    if (!session) {
      res
        .status(404)
        .type("html")
        .send(
          `<!doctype html><meta charset="utf-8"><title>Not found</title><style>${BASE_CSS}</style><header><h1>Merman Compiler</h1></header><main class="single"><p class="empty">Session not found or expired. <a href="/explorer">Back to all sessions</a>.</p></main>`
        );
      return;
    }
    res.type("html").send(renderSessionPage(session as any));
  });

  router.get("/sessions/:id", (req, res) => {
    const session = store.get(req.params.id);
    if (!session) {
      res.status(404).json({ error: "Session not found or expired" });
      return;
    }
    res.json({
      id: session.id,
      createdAt: session.createdAt,
      explorerUrl: `/explorer/${session.id}`,
      ...session.result,
    });
  });

  router.get("/sessions/:id/files/*", (req, res) => {
    const path = decodeURIComponent((req.params as { 0: string })[0]);
    const file = store.findFile(req.params.id, path);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.type("text/plain").send(file.content);
  });

  return router;
}
