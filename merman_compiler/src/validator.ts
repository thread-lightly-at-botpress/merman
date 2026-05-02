import { CompilationIssue, MermaidModel } from "./types.js";

export class ModelValidator {
  validate(model: MermaidModel): { warnings: CompilationIssue[]; errors: CompilationIssue[] } {
    const warnings: CompilationIssue[] = [];
    const errors: CompilationIssue[] = [];
    const classNames = new Set(model.classes.map((c) => c.name));

    for (const rel of model.relationships) {
      if (!classNames.has(rel.from)) {
        errors.push({
          code: "UNKNOWN_CLASS",
          message: `Relationship source '${rel.from}' does not exist`,
        });
      }
      if (!classNames.has(rel.to)) {
        errors.push({
          code: "UNKNOWN_CLASS",
          message: `Relationship target '${rel.to}' does not exist`,
        });
      }
      if (rel.fromMultiplicity || rel.toMultiplicity) {
        if (!this.isValidMultiplicity(rel.fromMultiplicity)) {
          errors.push({
            code: "BAD_MULTIPLICITY",
            message: `Invalid multiplicity '${rel.fromMultiplicity}'`,
          });
        }
        if (!this.isValidMultiplicity(rel.toMultiplicity)) {
          errors.push({
            code: "BAD_MULTIPLICITY",
            message: `Invalid multiplicity '${rel.toMultiplicity}'`,
          });
        }
      }
    }

    this.detectInheritanceCycles(model, errors);
    this.validateMethods(model, errors, warnings);

    return { warnings, errors };
  }

  private validateMethods(
    model: MermaidModel,
    errors: CompilationIssue[],
    warnings: CompilationIssue[]
  ): void {
    const parents = new Map<string, string[]>();
    model.relationships
      .filter((r) => r.kind === "inheritance" || r.kind === "implementation")
      .forEach((r) => {
        const existing = parents.get(r.from) ?? [];
        existing.push(r.to);
        parents.set(r.from, existing);
      });

    const byName = new Map(model.classes.map((c) => [c.name, c]));
    for (const cls of model.classes) {
      const parentNames = parents.get(cls.name) ?? [];
      for (const parentName of parentNames) {
        const parent = byName.get(parentName);
        if (!parent) continue;
        for (const m of cls.methods) {
          const inherited = parent.methods.find((pm) => pm.name === m.name);
          if (!inherited) continue;
          if (
            inherited.parameters.length !== m.parameters.length ||
            inherited.returnType !== m.returnType
          ) {
            errors.push({
              code: "BAD_OVERRIDE_SIGNATURE",
              message: `Method '${cls.name}.${m.name}' is incompatible with parent signature`,
            });
          } else if (!m.isOverride) {
            warnings.push({
              code: "MISSING_OVERRIDE",
              message: `Method '${cls.name}.${m.name}' overrides parent method but is not marked as override`,
            });
          }
        }
      }
    }
  }

  private detectInheritanceCycles(model: MermaidModel, errors: CompilationIssue[]): void {
    const graph = new Map<string, string[]>();
    model.classes.forEach((c) => graph.set(c.name, []));
    model.relationships
      .filter((r) => r.kind === "inheritance" || r.kind === "implementation")
      .forEach((r) => graph.get(r.from)?.push(r.to));

    const seen = new Set<string>();
    const inStack = new Set<string>();

    const dfs = (node: string) => {
      if (inStack.has(node)) {
        errors.push({
          code: "INHERITANCE_CYCLE",
          message: `Circular inheritance detected around '${node}'`,
        });
        return;
      }
      if (seen.has(node)) return;
      seen.add(node);
      inStack.add(node);
      for (const next of graph.get(node) ?? []) {
        dfs(next);
      }
      inStack.delete(node);
    };

    for (const n of graph.keys()) dfs(n);
  }

  private isValidMultiplicity(raw?: string): boolean {
    if (!raw) return true;
    return /^(?:\*|[0-9]+(?:\.\.(?:\*|[0-9]+))?)$/.test(raw.trim());
  }
}
