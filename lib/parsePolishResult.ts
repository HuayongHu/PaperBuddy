import type { PolishBlock, PolishParseResult } from "@/types/polish";

const START = "---PARA_START---";
const END = "---PARA_END---";

function extractSection(block: string, label: string, nextLabels: string[]): string {
  const start = block.indexOf(label);
  if (start < 0) {
    return "";
  }

  const contentStart = start + label.length;
  const nextIndexes = nextLabels
    .map((nextLabel) => block.indexOf(nextLabel, contentStart))
    .filter((index) => index >= 0);
  const contentEnd = nextIndexes.length > 0 ? Math.min(...nextIndexes) : block.length;

  return block.slice(contentStart, contentEnd).trim();
}

function parseAnalysis(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : ["表达准确，无需修改"];
}

function parseBlock(rawBlock: string): PolishBlock {
  const original = extractSection(rawBlock, "【原文】", ["【问题分析】", "【润色结果】"]);
  const analysis = extractSection(rawBlock, "【问题分析】", ["【润色结果】"]);
  const polished = extractSection(rawBlock, "【润色结果】", []);

  return {
    original,
    analysis: parseAnalysis(analysis),
    polished
  };
}

export function parsePolishResult(raw: string): PolishParseResult {
  const blocks: PolishBlock[] = [];
  let cursor = 0;
  let pending = "";

  while (cursor < raw.length) {
    const start = raw.indexOf(START, cursor);
    if (start < 0) {
      break;
    }

    const contentStart = start + START.length;
    const end = raw.indexOf(END, contentStart);
    if (end < 0) {
      pending = raw.slice(start).trim();
      break;
    }

    const content = raw.slice(contentStart, end).trim();
    if (content) {
      blocks.push(parseBlock(content));
    }
    cursor = end + END.length;
  }

  return { blocks, pending };
}
