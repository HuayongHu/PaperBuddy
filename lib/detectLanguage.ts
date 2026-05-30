import type { Language } from "@/types/polish";

export function detectLanguage(text: string): Language {
  const compact = text.trim();
  if (!compact) {
    return "auto";
  }

  const chineseMatches = compact.match(/[\u3400-\u9fff]/g) ?? [];
  const latinMatches = compact.match(/[A-Za-z]/g) ?? [];
  const signal = chineseMatches.length + latinMatches.length;

  if (signal < 8) {
    return "auto";
  }

  return chineseMatches.length >= latinMatches.length * 0.35 ? "zh" : "en";
}
