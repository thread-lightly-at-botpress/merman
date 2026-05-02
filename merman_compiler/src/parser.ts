import {
  AttributeNode,
  ClassNode,
  MermaidModel,
  MethodNode,
  ParameterNode,
  RelationshipKind,
  RelationshipNode,
  Visibility,
} from "./types.js";

const RELATION_TOKEN_MAP: Record<string, RelationshipKind> = {
  "<|--": "inheritance",
  "--|>": "inheritance",
  "<|..": "implementation",
  "..|>": "implementation",
  "o--": "aggregation",
  "--o": "aggregation",
  "*--": "composition",
  "--*": "composition",
  "..>": "dependency",
  "-->": "association",
  "<--": "association",
  "--": "association",
};

const METHOD_HEAD_RE =
  /^([+\-#~])?(\$)?([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)(.*)$/;
const ATTRIBUTE_COLON_RE =
  /^([+\-#~])?(\$)?([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([^=]+?)(\s*=\s*(.+))?$/;
const ATTRIBUTE_TYPED_RE =
  /^([+\-#~])?(\$)?([A-Za-z_][\w<>,\s\[\]]*?)\s+([A-Za-z_][A-Za-z0-9_]*)(\s*=\s*(.+))?$/;

export class MermaidParser {
  parse(input: string): MermaidModel {
    const lines = input.split(/\r?\n/);
    const classes = new Map<string, ClassNode>();
    const relationships: RelationshipNode[] = [];
    const globalComments: string[] = [];
    let currentClass: ClassNode | null = null;
    let currentNamespace: string | undefined;
    let pendingComments: string[] = [];

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      const lineNo = idx + 1;

      if (!line) {
        return;
      }
      if (line.startsWith("%%")) {
        pendingComments.push(line.replace(/^%%\s?/, ""));
        globalComments.push(line.replace(/^%%\s?/, ""));
        return;
      }
      if (line === "classDiagram" || line.startsWith("direction ")) {
        return;
      }
      if (line.startsWith("namespace ")) {
        const match = line.match(/^namespace\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{?$/);
        if (!match) {
          throw new Error(`Invalid namespace declaration at line ${lineNo}`);
        }
        currentNamespace = match[1];
        return;
      }
      if (line === "}") {
        if (currentClass) {
          currentClass = null;
        } else {
          currentNamespace = undefined;
        }
        return;
      }

      const classDecl = line.match(
        /^class\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+<<\s*(interface|abstract|enum)\s*>>)?\s*(\{)?$/
      );
      if (classDecl) {
        const [, className, stereotype] = classDecl;
        const kind =
          stereotype === "interface"
            ? "interface"
            : stereotype === "abstract"
            ? "abstract"
            : stereotype === "enum"
            ? "enum"
            : "class";
        const node: ClassNode = {
          name: className,
          kind,
          namespace: currentNamespace,
          attributes: [],
          methods: [],
          enumValues: [],
          comments: pendingComments,
        };
        classes.set(className, node);
        currentClass = classDecl[3] ? node : null;
        pendingComments = [];
        return;
      }

      const relation = this.parseRelationship(line);
      if (relation) {
        relationships.push(relation);
        return;
      }

      if (currentClass) {
        if (currentClass.kind === "enum") {
          currentClass.enumValues.push(line);
          return;
        }

        if (line.startsWith("py:")) {
          const method: MethodNode = {
            name: "user_defined",
            visibility: "public",
            returnType: "void",
            parameters: [],
            userCode: line.slice(3).trim(),
            comments: [],
          };
          currentClass.methods.push(method);
          return;
        }

        const parsed = this.parseClassMember(line, pendingComments);
        pendingComments = [];
        if (parsed.kind === "attribute") {
          currentClass.attributes.push(parsed.node);
          return;
        }
        currentClass.methods.push(parsed.node);
        return;
      }

      throw new Error(`Unrecognized Mermaid syntax at line ${lineNo}: ${line}`);
    });

    return {
      classes: [...classes.values()],
      relationships,
      comments: globalComments,
    };
  }

  private parseRelationship(line: string): RelationshipNode | null {
    const relRe =
      /^([A-Za-z_][A-Za-z0-9_]*)(?:\s+"([^"]+)")?\s*(<\|--|--\|>|<\|\.\.|\.\.\|>|o--|--o|\*--|--\*|\.\.>|-->|<--|--)\s*(?:\s+"([^"]+)")?\s*([A-Za-z_][A-Za-z0-9_]*)(?:\s*:\s*(.+))?$/;
    const match = line.match(relRe);
    if (!match) {
      return null;
    }
    const [, left, leftMultiplicity, token, rightMultiplicity, right, label] = match;
    const reverse = token === "<|--" || token === "<|.." || token === "<--";
    const from = reverse ? right : left;
    const to = reverse ? left : right;
    const fromMultiplicity = reverse ? rightMultiplicity : leftMultiplicity;
    const toMultiplicity = reverse ? leftMultiplicity : rightMultiplicity;

    return {
      from,
      to,
      kind: RELATION_TOKEN_MAP[token],
      fromMultiplicity,
      toMultiplicity,
      label,
    };
  }

  private parseClassMember(
    line: string,
    comments: string[]
  ): { kind: "attribute"; node: AttributeNode } | { kind: "method"; node: MethodNode } {
    const method = line.match(METHOD_HEAD_RE);
    if (method) {
      const [, vis, isStatic, name, paramsRaw, tailRaw] = method;
      let tail = tailRaw.trim();
      let trailingAbstract = false;
      let trailingStatic = false;

      // Mermaid trailing modifiers: ()* = abstract, ()$ = static
      if (tail.startsWith("*")) {
        trailingAbstract = true;
        tail = tail.slice(1).trim();
      } else if (tail.startsWith("$")) {
        trailingStatic = true;
        tail = tail.slice(1).trim();
      }

      // Optional <<annotation>> at the end
      let annotationRaw = "";
      const annMatch = tail.match(/^(.*?)\s*(<<[^>]+>>)\s*$/);
      if (annMatch) {
        tail = annMatch[1].trim();
        annotationRaw = annMatch[2];
      }

      // Optional return type: either ": Type" (TS-style) or "Type" (Mermaid-style)
      let returnType = "void";
      if (tail.startsWith(":")) {
        tail = tail.slice(1).trim();
      }
      if (tail) {
        returnType = tail;
      }

      const annotations = annotationRaw.toLowerCase();
      return {
        kind: "method",
        node: {
          name,
          visibility: this.mapVisibility(vis),
          returnType,
          parameters: this.parseParameters(paramsRaw),
          isStatic: !!isStatic || trailingStatic || annotations.includes("static"),
          isClassMethod: annotations.includes("classmethod"),
          isAbstract: trailingAbstract || annotations.includes("abstract"),
          isOverride: annotations.includes("override"),
          comments,
        },
      };
    }

    const colonAttr = line.match(ATTRIBUTE_COLON_RE);
    if (colonAttr) {
      const [, vis, isStatic, name, typeRaw, , defaultValueRaw] = colonAttr;
      return {
        kind: "attribute",
        node: {
          name,
          type: typeRaw.trim(),
          visibility: this.mapVisibility(vis),
          defaultValue: defaultValueRaw?.trim(),
          isStatic: !!isStatic,
          comments,
        },
      };
    }

    const typedAttr = line.match(ATTRIBUTE_TYPED_RE);
    if (typedAttr) {
      const [, vis, isStatic, typeRaw, name, , defaultValueRaw] = typedAttr;
      return {
        kind: "attribute",
        node: {
          name,
          type: typeRaw.trim(),
          visibility: this.mapVisibility(vis),
          defaultValue: defaultValueRaw?.trim(),
          isStatic: !!isStatic,
          comments,
        },
      };
    }

    throw new Error(`Invalid class member syntax: ${line}`);
  }

  private mapVisibility(raw?: string): Visibility {
    switch (raw) {
      case "-":
        return "private";
      case "#":
        return "protected";
      case "~":
        return "package";
      default:
        return "public";
    }
  }

  private parseParameters(raw: string): ParameterNode[] {
    const text = raw.trim();
    if (!text) {
      return [];
    }
    return text.split(",").map((entry) => {
      const trimmed = entry.trim();
      if (!trimmed) {
        throw new Error(`Invalid parameter syntax: ${entry}`);
      }

      // Split off optional default value first: "x: int = 5" or "int x = 5"
      const eqIdx = trimmed.indexOf("=");
      const head = eqIdx >= 0 ? trimmed.slice(0, eqIdx).trim() : trimmed;
      const defaultValue = eqIdx >= 0 ? trimmed.slice(eqIdx + 1).trim() : undefined;

      let name: string;
      let type: string;

      if (head.includes(":")) {
        const [namePart, typePart] = head.split(":").map((s) => s.trim());
        if (!namePart) {
          throw new Error(`Invalid parameter syntax: ${entry}`);
        }
        name = namePart;
        type = typePart || "any";
      } else {
        const parts = head.split(/\s+/);
        if (parts.length === 1) {
          name = parts[0];
          type = "any";
        } else {
          name = parts[parts.length - 1];
          type = parts.slice(0, -1).join(" ");
        }
      }

      if (!name) {
        throw new Error(`Invalid parameter syntax: ${entry}`);
      }

      return {
        name,
        type,
        defaultValue: defaultValue || undefined,
      };
    });
  }
}
