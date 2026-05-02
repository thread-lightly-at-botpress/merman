export type Visibility = "public" | "private" | "protected" | "package";

export type ClassKind = "class" | "interface" | "abstract" | "enum";

export type RelationshipKind =
  | "inheritance"
  | "implementation"
  | "association"
  | "aggregation"
  | "composition"
  | "dependency";

export interface TypeConstraint {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  regex?: string;
}

export interface AttributeNode {
  name: string;
  type: string;
  visibility: Visibility;
  defaultValue?: string;
  isStatic?: boolean;
  constraints?: TypeConstraint;
  comments: string[];
}

export interface ParameterNode {
  name: string;
  type: string;
  defaultValue?: string;
}

export interface MethodNode {
  name: string;
  visibility: Visibility;
  returnType: string;
  parameters: ParameterNode[];
  isStatic?: boolean;
  isClassMethod?: boolean;
  isAbstract?: boolean;
  isOverride?: boolean;
  userCode?: string;
  comments: string[];
}

export interface ClassNode {
  name: string;
  kind: ClassKind;
  namespace?: string;
  attributes: AttributeNode[];
  methods: MethodNode[];
  enumValues: string[];
  comments: string[];
}

export interface RelationshipNode {
  from: string;
  to: string;
  kind: RelationshipKind;
  fromMultiplicity?: string;
  toMultiplicity?: string;
  label?: string;
}

export interface MermaidModel {
  classes: ClassNode[];
  relationships: RelationshipNode[];
  comments: string[];
}

export interface CompilationIssue {
  code: string;
  message: string;
  line?: number;
}

export interface CompileOptions {
  targetLanguage: "cpp" | "python";
  writeToDisk?: boolean;
  outputDir?: string;
  namespaceAsDirs?: boolean;
}

export interface GeneratedFile {
  path: string;
  content: string;
  className: string;
}

export interface CompileResult {
  files: GeneratedFile[];
  warnings: CompilationIssue[];
  errors: CompilationIssue[];
  metadata: {
    classCount: number;
    relationshipCount: number;
    targetLanguage: "cpp" | "python";
    generatedAt: string;
  };
}
