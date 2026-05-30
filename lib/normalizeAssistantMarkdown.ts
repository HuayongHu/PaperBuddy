const HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const LATEX_COMMAND_PATTERN =
  /\\(?:alpha|beta|gamma|delta|epsilon|varepsilon|theta|lambda|mu|sigma|tau|phi|varphi|omega|frac|sum|prod|int|lim|sqrt|qquad|quad|in|leq|geq|neq|cdot|times|mathbf|mathcal|mathrm|text)/;

function hasLatexSignal(value: string) {
  return LATEX_COMMAND_PATTERN.test(value) || /[_^]\{?[\w\\]/.test(value);
}

function normalizeLatexSpacing(value: string) {
  return value
    .replace(/\s*;\s*=\s*;\s*/g, " = ")
    .replace(/\s*;\s*(?=\\[A-Za-z])/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeBracketedMathBlocks(value: string) {
  const lines = value.split("\n");
  const normalized: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed !== "[") {
      normalized.push(line);
      continue;
    }

    const blockLines: string[] = [];
    let closingIndex = -1;

    for (let innerIndex = index + 1; innerIndex < lines.length; innerIndex += 1) {
      if (lines[innerIndex].trim() === "]") {
        closingIndex = innerIndex;
        break;
      }
      blockLines.push(lines[innerIndex]);
    }

    const block = blockLines.join("\n").trim();
    if (closingIndex === -1 || !block || !hasLatexSignal(block)) {
      normalized.push(line);
      continue;
    }

    normalized.push("$$", normalizeLatexSpacing(block), "$$");
    index = closingIndex;
  }

  return normalized.join("\n");
}

export function normalizeAssistantMarkdown(markdown: string) {
  return normalizeBracketedMathBlocks(markdown.replace(HTML_BREAK_PATTERN, "\n"));
}
