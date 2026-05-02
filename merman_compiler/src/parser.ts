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

const METHOD_RE =
  /^([+\-#~])?(\$)?([A-Za-z_][A-Za-z0-9_]*)\((.*)\)\s*([:*]\s*([^\s]+))?\s*(<<[^>]+>>)?$/;
const ATTRIBUTE_RE =
  /^([+\-#~])?(\$)?([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([^=]+?)(\s*=\s*(.+))?$/;

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
    const method = line.match(METHOD_RE);
    if (method) {
      const [, vis, isStatic, name, paramsRaw, , returnTypeRaw, annotationRaw] = method;
      const annotations = (annotationRaw ?? "").toLowerCase();
      return {
        kind: "method",
        node: {
          name,
          visibility: this.mapVisibility(vis),
          returnType: returnTypeRaw?.trim() || "void",
          parameters: this.parseParameters(paramsRaw),
          isStatic: !!isStatic || annotations.includes("static"),
          isClassMethod: annotations.includes("classmethod"),
          isAbstract: annotations.includes("abstract"),
          isOverride: annotations.includes("override"),
          comments,
        },
      };
    }

    const attribute = line.match(ATTRIBUTE_RE);
    if (!attribute) {
      throw new Error(`Invalid class member syntax: ${line}`);
    }
    const [, vis, isStatic, name, typeRaw, , defaultValueRaw] = attribute;
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
      const [namePart, typePart] = entry.split(":").map((s) => s.trim());
      if (!namePart || !typePart) {
        throw new Error(`Invalid parameter syntax: ${entry}`);
      }
      const [type, defaultValue] = typePart.split("=").map((s) => s.trim());
      return {
        name: namePart,
        type,
        defaultValue: defaultValue || undefined,
      };
    });
  }
}
