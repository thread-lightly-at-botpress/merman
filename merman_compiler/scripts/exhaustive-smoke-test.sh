#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="${ROOT_DIR}/tmp/exhaustive-smoke"
MODEL_FILE="${WORK_DIR}/exhaustive-model.mermaid"
MULTI_FILE="${WORK_DIR}/multiplicity-matrix.mermaid"
OUT_CPP="${WORK_DIR}/out-cpp"
OUT_PY="${WORK_DIR}/out-py"

echo "[1/7] Preparing workspace: ${WORK_DIR}"
rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}" "${OUT_CPP}" "${OUT_PY}"

echo "[2/7] Writing expressive Mermaid model fixture"
cat > "${MODEL_FILE}" <<'EOF'
classDiagram
%% Global comment for generated output
direction LR

namespace core {
  class IBaseService <<interface>> {
    +start(): void <<abstract>>
    +stop(): void <<abstract>>
  }

  class Entity <<abstract>> {
    +id: int = 0
    #createdAt: string
    +save(): bool <<abstract>>
  }

  class User {
    +username: string
    -passwordHash: string
    #roles: string[]
    +login(password: string): bool
    +serialize(): Dict<string,string>
    py:def custom_logic(self): return "ok"
  }

  class Admin {
    +level: int = 1
    +approve(userId: int): bool <<override>>
  }

  class CacheStore {
    +entries: Dict<string, string>
    +get(key: string): string
    +set(key: string, value: string): void
  }

  class EventLog {
    +events: List<string>
    +append(event: string): void
  }

  class Status <<enum>> {
    PENDING
    ACTIVE
    SUSPENDED
  }
}

namespace infra {
  class HttpClient {
    +baseUrl: string = "https://api.example.com"
    +get(path: string): string
    +post(path: string, body: string): string
  }
}

Entity <|-- User
User <|-- Admin
IBaseService <|.. CacheStore
IBaseService <|.. EventLog

User "1" --> "0..*" EventLog : emits
User "1" o-- "0..*" CacheStore : uses_cache
Admin "1" *-- "1..5" User : manages
HttpClient ..> User : fetches
User --> Status : state
EOF

echo "[3/7] Writing multiplicity matrix fixture"
cat > "${MULTI_FILE}" <<'EOF'
classDiagram
class Left
class Right
Left "1" --> "1" Right : one_to_one
Left "0..1" --> "1" Right : optional_to_one
Left "1" --> "0..*" Right : one_to_many
Left "0..*" --> "0..*" Right : many_to_many
Left "1..5" --> "*" Right : bounded_to_unbounded
Left "*" --> "1..10" Right : unbounded_to_bounded
Left "2..2" --> "3..3" Right : exact_ranges
EOF

echo "[4/7] Building TypeScript backend"
npm --prefix "${ROOT_DIR}" run build >/dev/null

echo "[5/7] Validating fixtures"
node "${ROOT_DIR}/dist/cli.js" --input "${MODEL_FILE}" --validate-only >/dev/null
node "${ROOT_DIR}/dist/cli.js" --input "${MULTI_FILE}" --validate-only >/dev/null

echo "[6/7] Compiling fixtures to C++ and Python"
node "${ROOT_DIR}/dist/cli.js" --input "${MODEL_FILE}" --target cpp --output "${OUT_CPP}" >/dev/null
node "${ROOT_DIR}/dist/cli.js" --input "${MODEL_FILE}" --target python --output "${OUT_PY}" >/dev/null
node "${ROOT_DIR}/dist/cli.js" --input "${MULTI_FILE}" --target cpp --output "${OUT_CPP}" >/dev/null

echo "[7/7] Verifying generated outputs exist"
test -f "${OUT_CPP}/core/User.hpp"
test -f "${OUT_CPP}/core/User.cpp"
test -f "${OUT_CPP}/core/Admin.hpp"
test -f "${OUT_CPP}/core/Status.hpp"
test -f "${OUT_CPP}/Left.hpp"
test -f "${OUT_CPP}/Right.hpp"
test -f "${OUT_PY}/core/User.py"
test -f "${OUT_PY}/core/Status.py"

echo "PASS: Exhaustive Mermaid smoke test completed."
echo "Artifacts:"
echo "  - ${MODEL_FILE}"
echo "  - ${MULTI_FILE}"
echo "  - ${OUT_CPP}"
echo "  - ${OUT_PY}"
