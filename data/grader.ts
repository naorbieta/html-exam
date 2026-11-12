/** 問題フォルダの採点TSが import type するための型です。実行時には使われません。 */
export type GraderHelpers = {
  assert: (condition: unknown, message?: string) => void;
  source: string;
  document: any;
  window: any;
  logs: unknown[][];
  alerts: string[];
  doctype?: { name: string } | null;
  logText: () => string[];
  text: (selector: string) => string;
  fire: (target: any, type: string, properties?: Record<string, unknown>) => void;
  click: (selector: string) => void;
  key: (key: string) => void;
  advance: (duration: number) => void;
  promptCount: number;
  confirmCalls: number;
  randomCount: number;
  css?: (selector: string, pseudo?: string) => CSSStyleDeclaration;
  el?: (selector: string) => Element;
  all?: (selector: string) => Element[];
  rect?: (selector: string) => DOMRect;
  near?: (actual: number, expected: number, message: string, tolerance?: number) => void;
  overlap?: (a: string, b: string) => boolean;
  hover?: (selector: string) => void;
  polygon?: (selector: string) => number[][];
  animations?: (selector: string) => Animation[];
  sample?: (animation: Animation, fraction: number) => void;
  frame?: () => Promise<void>;
  rules?: (selector: string) => CSSStyleRule[];
  gradient?: (selector: string) => { type: string; direction: number; colors: { r: number; g: number; b: number; a: number }[] };
  answer?: string;
  answers?: Record<string, string>;
};

/** ターミナル問題の初期状態。パスは ~ から書きます。末尾が / ならフォルダです。 */
export type TerminalInitial = {
  cwd?: string;
  files?: Record<string, string>;
  repos?: Record<string, { commits: { message: string; files: Record<string, string> }[]; branch?: string; remote?: string }>;
  remotes?: Record<string, { commits: { message: string; files: Record<string, string> }[] }>;
  overrides?: Record<string, string | null>;
};

export type TerminalRepo = {
  root: string; branch: string; head: string | null; branches: Record<string, string>; remote: string | null;
  upstream: Record<string, string>;
  log: { id: string; message: string; files: Record<string, string> }[];
  staged: string[]; unstaged: string[]; untracked: string[]; index: Record<string, string>;
};

/** kind: 'terminal' の check(h) に渡される操作後の状態です。 */
export type TerminalHelpers = {
  assert: (condition: unknown, message?: string) => void;
  commands: string[];
  cwd: string;
  exists: (path: string) => boolean;
  isDir: (path: string) => boolean;
  isFile: (path: string) => boolean;
  read: (path: string) => string | null;
  list: (path: string) => string[];
  repo: (path: string) => TerminalRepo | null;
  repos: () => TerminalRepo[];
  remote: (url: string) => { branches: Record<string, string>; log: (branch?: string) => { id: string; message: string; files: Record<string, string> }[] } | null;
};

export type GraderCase = {
  label?: string;
  prompts?: string[];
  confirms?: boolean[];
  randoms?: number[];
  prefix?: string;
  html?: string;
  width?: number;
  height?: number;
  check?: string | ((h: GraderHelpers) => unknown);
};

export type Grader = {
  kind: 'text' | 'code' | 'render' | 'dom' | 'file' | 'manual' | 'terminal';
  /** ターミナル問題の初期状態（ファイル・リポジトリ・リモート） */
  initial?: TerminalInitial;
  check?: string | ((h: GraderHelpers & TerminalHelpers) => unknown);
  cases?: GraderCase[];
  requires?: string[];
  requirementHint?: string;
  previous?: string | string[];
  completeProgram?: boolean;
  context?: { name: string; code: string }[];
  aggregate?: string;
  html?: string;
  documentAnswer?: boolean;
  htmlAnswer?: boolean;
  scaffold?: { detect: string; prefix?: string; after?: string };
  resolveUrl?: boolean;
  target?: string;
  htmlId?: boolean;
  fragmentFor?: string;
  task?: string;
  selector?: string;
  initialText?: string;
  initialColor?: string;
  exerciseHtml?: string;
  contrast?: { background: string; minimum: number };
  accept?: string[];
  acceptSets?: string[][];
  pairs?: { labels: string[]; numbers: string[] }[];
  extension?: string;
  [key: string]: unknown;
};
