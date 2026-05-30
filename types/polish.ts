export type PolishMode = "light" | "academic" | "rewrite";

export type Language = "zh" | "en" | "auto";

export interface PolishBlock {
  original: string;
  chineseTranslation: string;
  analysis: string[];
  polished: string;
  polishedChineseTranslation: string;
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
