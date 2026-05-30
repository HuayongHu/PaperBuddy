export type PolishMode = "light" | "academic" | "rewrite";

export type Language = "zh" | "en" | "auto";

export interface PolishBlock {
  original: string;
  analysis: string[];
  polished: string;
}

export interface PolishParseResult {
  blocks: PolishBlock[];
  pending: string;
}

export interface PolishRecord {
  id: string;
  timestamp: number;
  mode: PolishMode;
  language: Language;
  inputText: string;
  result: string;
}
