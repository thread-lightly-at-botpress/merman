# Merman Compiler Backend (TypeScript)

Compiles Mermaid `classDiagram` input into boilerplate files, one file per class.

## Supported Outputs

- `cpp` (default): Generates one `.hpp` file per class.
- `python`: Generates one `.py` file per class.

## REST API

- `GET /health`
- `GET /templates`
- `POST /validate`
- `POST /compile`

### Compile Request

```json
{
  "mermaid": "classDiagram\nclass User {+name: string}",
  "options": {
    "targetLanguage": "cpp",
    "writeToDisk": false,
    "outputDir": "./generated",
    "namespaceAsDirs": true
  }
}
```

### Compile Response

```json
{
  "files": [
    {
      "path": "User.hpp",
      "className": "User",
      "content": "#pragma once\n..."
    }
  ],
  "warnings": [],
  "errors": [],
  "metadata": {
    "classCount": 1,
    "relationshipCount": 0,
    "targetLanguage": "cpp",
    "generatedAt": "2026-05-02T00:00:00.000Z"
  }
}
```

`files` is always an array so frontend can render/write every generated class file independently.

## CLI

### Local Mode

```bash
npm run cli -- --input model.mermaid --target cpp --output .
```

### Remote API Mode

```bash
npm run cli -- --input model.mermaid --remote http://localhost:8080 --output .
```

## Dev

```bash
npm install
npm run dev
```
