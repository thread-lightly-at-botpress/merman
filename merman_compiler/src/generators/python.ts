import { ClassNode, MermaidModel } from "../types.js";

function pyVisibility(name: string, vis: string): string {
  if (vis === "private") return `__${name}`;
  if (vis === "protected") return `_${name}`;
  return name;
}

function pyType(input: string): string {
  const t = input.trim();
  if (t.endsWith("[]")) return `list[${pyType(t.slice(0, -2))}]`;
  if (t.startsWith("List<")) return `list[${pyType(t.slice(5, -1))}]`;
  if (t.startsWith("Dict<")) {
    const [k, v] = t
      .slice(5, -1)
      .split(",")
      .map((x) => x.trim());
    return `dict[${pyType(k)}, ${pyType(v)}]`;
  }
  return (
    {
      int: "int",
      float: "float",
      double: "float",
      char: "str",
      string: "str",
      bool: "bool",
      void: "None",
    }[t] ?? t
  );
}

export function generatePythonClass(model: MermaidModel, cls: ClassNode): string {
  const lines: string[] = [];
  const needsAbc = cls.kind === "interface" || cls.kind === "abstract";
  if (needsAbc) lines.push("from abc import ABC, abstractmethod");
  if (cls.kind === "enum") lines.push("from enum import Enum");
  lines.push("");
  lines.push(...cls.comments.map((c) => `# ${c}`));
  lines.push("");

  if (cls.kind === "enum") {
    lines.push(`class ${cls.name}(Enum):`);
    cls.enumValues.forEach((v, i) => lines.push(`    ${v} = ${i + 1}`));
    return lines.join("\n");
  }

  const bases = model.relationships
    .filter((r) => r.from === cls.name && (r.kind === "inheritance" || r.kind === "implementation"))
    .map((r) => r.to);
  if (needsAbc) bases.push("ABC");
  lines.push(`class ${cls.name}${bases.length ? `(${[...new Set(bases)].join(", ")})` : ""}:`);
  if (!cls.attributes.length && !cls.methods.length) {
    lines.push("    pass");
    return lines.join("\n");
  }

  lines.push("    def __init__(self) -> None:");
  if (!cls.attributes.length) {
    lines.push("        pass");
  } else {
    for (const attr of cls.attributes) {
      const name = pyVisibility(attr.name, attr.visibility);
      const type = pyType(attr.type);
      const defaultVal = attr.defaultValue ?? "None";
      lines.push(...attr.comments.map((c) => `        # ${c}`));
      lines.push(`        self.${name}: ${type} = ${defaultVal}`);
      if (attr.type.endsWith("[]") || attr.type.startsWith("List<")) {
        const itemType = pyType(attr.type.replace(/\[\]$/, ""));
        lines.push(``);
        lines.push(`    def get_all_${attr.name}(self) -> ${type}:`);
        lines.push(`        return self.${name}`);
        lines.push(``);
        lines.push(`    def get_at_index_${attr.name}(self, index: int) -> ${itemType}:`);
        lines.push(`        return self.${name}[index]`);
      }
    }
  }

  for (const method of cls.methods) {
    if (method.userCode) {
      lines.push("");
      lines.push(`    # user-defined method body from Mermaid`);
      lines.push(`    ${method.userCode}`);
      continue;
    }
    const decorators: string[] = [];
    if (method.isClassMethod) decorators.push("@classmethod");
    else if (method.isStatic) decorators.push("@staticmethod");
    if (cls.kind === "interface" || method.isAbstract) decorators.push("@abstractmethod");

    const receiver = method.isStatic ? "" : method.isClassMethod ? "cls" : "self";
    const args = method.parameters
      .map((p) => `${p.name}: ${pyType(p.type)}${p.defaultValue ? ` = ${p.defaultValue}` : ""}`)
      .join(", ");
    const argString = [receiver, args].filter(Boolean).join(", ");
    lines.push("");
    lines.push(...method.comments.map((c) => `    # ${c}`));
    decorators.forEach((d) => lines.push(`    ${d}`));
    lines.push(`    def ${method.name}(${argString}) -> ${pyType(method.returnType)}:`);
    lines.push("        raise NotImplementedError");
  }
  return lines.join("\n");
}
