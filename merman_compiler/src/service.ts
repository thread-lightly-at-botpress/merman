import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateCppFiles } from "./generators/cpp.js";
import { generatePythonClass } from "./generators/python.js";
import { MermaidParser } from "./parser.js";
import { ModelValidator } from "./validator.js";
import { CompileOptions, CompileResult, MermaidModel } from "./types.js";

export class CompilationService {
  private readonly parser = new MermaidParser();
  private readonly validator = new ModelValidator();

  async compileFromFile(filePath: string, options: CompileOptions): Promise<CompileResult> {
    const content = await readFile(filePath, "utf8");
    return this.compile(content, options);
  }

  async compile(input: string, options: CompileOptions): Promise<CompileResult> {
    let model: MermaidModel;
    try {
      model = this.parser.parse(input);
    } catch (err) {
      return {
        files: [],
        warnings: [],
        errors: [{ code: "PARSE_ERROR", message: (err as Error).message }],
        metadata: {
          classCount: 0,
          relationshipCount: 0,
          targetLanguage: options.targetLanguage,
          generatedAt: new Date().toISOString(),
        },
      };
    }

    const { warnings, errors } = this.validator.validate(model);
    if (errors.length) {
      return {
        files: [],
        warnings,
        errors,
        metadata: {
          classCount: model.classes.length,
          relationshipCount: model.relationships.length,
          targetLanguage: options.targetLanguage,
          generatedAt: new Date().toISOString(),
        },
      };
    }

    const files = model.classes.flatMap((cls) => {
      if (options.targetLanguage === "cpp") {
        const generated = generateCppFiles(model, cls);
        return generated.map((f) => ({
          ...f,
          path:
            cls.namespace && options.namespaceAsDirs
              ? path.join(cls.namespace, f.path)
              : f.path,
        }));
      }

      const pyFileName = `${cls.name}.py`;
      return [
        {
          className: cls.name,
          path:
            cls.namespace && options.namespaceAsDirs
              ? path.join(cls.namespace, pyFileName)
              : pyFileName,
          content: generatePythonClass(model, cls),
        },
      ];
    });

    if (options.writeToDisk) {
      const base = options.outputDir ?? process.cwd();
      for (const file of files) {
        const abs = path.join(base, file.path);
        await mkdir(path.dirname(abs), { recursive: true });
        await writeFile(abs, file.content, "utf8");
      }
    }

    return {
      files,
      warnings,
      errors: [],
      metadata: {
        classCount: model.classes.length,
        relationshipCount: model.relationships.length,
        targetLanguage: options.targetLanguage,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  async validate(input: string): Promise<{ warnings: unknown[]; errors: unknown[] }> {
    try {
      const model = this.parser.parse(input);
      return this.validator.validate(model);
    } catch (err) {
      return {
        warnings: [],
        errors: [{ code: "PARSE_ERROR", message: (err as Error).message }],
      };
    }
  }

  templates(): Array<{ id: string; targetLanguage: string; description: string }> {
    return [
      {
        id: "cpp-default",
        targetLanguage: "cpp",
        description: "C++ headers and source files per class with boilerplate class APIs",
      },
      {
        id: "python-default",
        targetLanguage: "python",
        description: "Python classes with ABC and enum support",
      },
    ];
  }
}
