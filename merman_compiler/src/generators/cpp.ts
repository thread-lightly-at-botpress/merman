import { ClassNode, GeneratedFile, MermaidModel, RelationshipNode } from "../types.js";

const CPP_TYPE_MAP: Record<string, string> = {
  int: "int",
  float: "float",
  double: "double",
  char: "char",
  string: "std::string",
  bool: "bool",
  void: "void",
};

function mapType(input: string): string {
  const raw = input.trim();
  if (raw.endsWith("[]")) return `std::vector<${mapType(raw.slice(0, -2))}>`;
  if (raw.startsWith("List<")) return `std::vector<${mapType(raw.slice(5, -1))}>`;
  if (raw.startsWith("Dict<")) {
    const [k, v] = raw
      .slice(5, -1)
      .split(",")
      .map((p) => p.trim());
    return `std::unordered_map<${mapType(k)}, ${mapType(v)}>`;
  }
  return CPP_TYPE_MAP[raw] ?? raw;
}

function visToCpp(vis: string): "public" | "private" | "protected" {
  if (vis === "private") return "private";
  if (vis === "protected") return "protected";
  return "public";
}

function memberName(name: string, vis: string): string {
  if (vis === "private") return `_${name}`;
  if (vis === "protected") return `m_${name}`;
  return name;
}

function toPascal(name: string): string {
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

function includesForClass(cls: ClassNode): string[] {
  const imports = new Set<string>(["#include <string>"]);
  const allTypes = [
    ...cls.attributes.map((a) => a.type),
    ...cls.methods.map((m) => m.returnType),
    ...cls.methods.flatMap((m) => m.parameters.map((p) => p.type)),
  ];
  if (allTypes.some((t) => t.includes("[]") || t.startsWith("List<"))) {
    imports.add("#include <vector>");
    imports.add("#include <cstddef>");
  }
  if (allTypes.some((t) => t.startsWith("Dict<"))) imports.add("#include <unordered_map>");
  if (cls.kind === "enum") imports.add("#include <cstdint>");
  return [...imports];
}

function relationshipComments(className: string, rels: RelationshipNode[]): string[] {
  return rels
    .filter((r) => r.from === className || r.to === className)
    .map((r) => {
      const mult = `${r.fromMultiplicity ?? "?"} -> ${r.toMultiplicity ?? "?"}`;
      return `// relation: ${r.from} ${r.kind} ${r.to} [${mult}]${r.label ? ` label=${r.label}` : ""}`;
    });
}

function inheritedBases(model: MermaidModel, cls: ClassNode): string[] {
  return model.relationships
    .filter((r) => r.from === cls.name && (r.kind === "inheritance" || r.kind === "implementation"))
    .map((r) => r.to);
}

function typePassByConstRef(cppType: string): boolean {
  return cppType.includes("std::") || cppType.includes("vector<") || cppType.includes("unordered_map<");
}

function getterReturnType(cppType: string): string {
  return typePassByConstRef(cppType) ? `const ${cppType}&` : cppType;
}

function setterArgType(cppType: string): string {
  return typePassByConstRef(cppType) ? `const ${cppType}&` : cppType;
}

export function generateCppFiles(model: MermaidModel, cls: ClassNode): GeneratedFile[] {
  const headerName = `${cls.name}.hpp`;
  if (cls.kind === "enum") {
    const enumLines: string[] = [
      "#pragma once",
      ...includesForClass(cls),
      "",
      ...relationshipComments(cls.name, model.relationships),
      ...cls.comments.map((c) => `// ${c}`),
      "",
      `enum class ${cls.name} {`,
      ...cls.enumValues.map((v, idx) => `  ${v}${idx < cls.enumValues.length - 1 ? "," : ""}`),
      "};",
      "",
    ];
    return [{ className: cls.name, path: headerName, content: enumLines.join("\n") }];
  }

  const hpp: string[] = [];
  const cpp: string[] = [];

  hpp.push("#pragma once");
  includesForClass(cls).forEach((i) => hpp.push(i));

  const bases = inheritedBases(model, cls);
  for (const base of bases) {
    hpp.push(`#include "${base}.hpp"`);
  }

  hpp.push("");
  hpp.push(...relationshipComments(cls.name, model.relationships));
  hpp.push(...cls.comments.map((c) => `// ${c}`));
  hpp.push("");

  const inheritSuffix = bases.length ? ` : ${bases.map((b) => `public ${b}`).join(", ")}` : "";
  hpp.push(`class ${cls.name}${inheritSuffix} {`);

  const grouped = new Map<string, string[]>();
  grouped.set("public", []);
  grouped.set("protected", []);
  grouped.set("private", []);

  grouped.get("public")?.push(`  ${cls.name}() = default;`);
  grouped.get("public")?.push(`  virtual ~${cls.name}() = default;`);

  for (const attr of cls.attributes) {
    const vis = visToCpp(attr.visibility);
    const cppType = mapType(attr.type);
    const backing = memberName(attr.name, attr.visibility);
    const defaultPart = attr.defaultValue ? ` = ${attr.defaultValue}` : "";

    grouped.get(vis)?.push(...attr.comments.map((c) => `  // ${c}`));
    grouped.get(vis)?.push(`  ${attr.isStatic ? "static " : ""}${cppType} ${backing}${defaultPart};`);

    const pascal = toPascal(attr.name);
    grouped.get("public")?.push(`  ${getterReturnType(cppType)} get${pascal}() const;`);
    grouped.get("public")?.push(`  void set${pascal}(${setterArgType(cppType)} value);`);

    cpp.push(`${getterReturnType(cppType)} ${cls.name}::get${pascal}() const {`);
    cpp.push(`  return ${backing};`);
    cpp.push("}");
    cpp.push("");
    cpp.push(`void ${cls.name}::set${pascal}(${setterArgType(cppType)} value) {`);
    cpp.push(`  ${backing} = value;`);
    cpp.push("}");
    cpp.push("");

    if (attr.type.endsWith("[]") || attr.type.startsWith("List<")) {
      const itemType = mapType(attr.type.replace(/\[\]$/, ""));
      grouped.get("public")?.push(`  const ${cppType}& get_all_${attr.name}() const;`);
      grouped.get("public")?.push(`  ${itemType} get_at_index_${attr.name}(size_t index) const;`);

      cpp.push(`const ${cppType}& ${cls.name}::get_all_${attr.name}() const {`);
      cpp.push(`  return ${backing};`);
      cpp.push("}");
      cpp.push("");
      cpp.push(`${itemType} ${cls.name}::get_at_index_${attr.name}(size_t index) const {`);
      cpp.push(`  return ${backing}.at(index);`);
      cpp.push("}");
      cpp.push("");
    }
  }

  for (const method of cls.methods) {
    if (method.userCode) {
      grouped.get("public")?.push(`  // user code: ${method.userCode}`);
      continue;
    }

    const vis = visToCpp(method.visibility);
    const returnType = mapType(method.returnType);
    const params = method.parameters
      .map((p) => `${mapType(p.type)} ${p.name}${p.defaultValue ? ` = ${p.defaultValue}` : ""}`)
      .join(", ");
    const paramsNoDefault = method.parameters.map((p) => `${mapType(p.type)} ${p.name}`).join(", ");

    const overrideSuffix = method.isOverride ? " override" : "";
    const pureVirtual = cls.kind === "interface" || method.isAbstract;
    const staticPrefix = method.isStatic ? "static " : "";
    const virtualPrefix = pureVirtual && !method.isStatic ? "virtual " : "";
    const abstractSuffix = pureVirtual ? " = 0" : "";

    grouped.get(vis)?.push(...method.comments.map((c) => `  // ${c}`));
    grouped.get(vis)?.push(
      `  ${virtualPrefix}${staticPrefix}${returnType} ${method.name}(${params})${overrideSuffix}${abstractSuffix};`
    );

    if (pureVirtual || method.isStatic) continue;

    cpp.push(`${returnType} ${cls.name}::${method.name}(${paramsNoDefault}) {`);
    for (const param of method.parameters) {
      cpp.push(`  (void)${param.name};`);
    }
    cpp.push('  throw std::runtime_error("Not implemented");');
    cpp.push("}");
    cpp.push("");
  }

  for (const vis of ["public", "protected", "private"]) {
    const entries = grouped.get(vis) ?? [];
    if (!entries.length) continue;
    hpp.push(`${vis}:`);
    hpp.push(...entries);
    hpp.push("");
  }

  hpp.push("};");
  hpp.push("");

  const cppLines: string[] = [];
  cppLines.push(`#include "${headerName}"`);
  cppLines.push("#include <stdexcept>");
  cppLines.push("");
  cppLines.push(...cpp);

  return [
    { className: cls.name, path: headerName, content: hpp.join("\n") },
    { className: cls.name, path: `${cls.name}.cpp`, content: cppLines.join("\n") },
  ];
}
