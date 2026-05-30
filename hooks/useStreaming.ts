type TokenHandler = (token: string) => void;

function extractDelta(line: string): string {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) {
    return "";
  }

  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") {
    return "";
  }

  try {
    const parsed = JSON.parse(payload) as {
      choices?: Array<{
        delta?: { content?: string; reasoning_content?: string };
        message?: { content?: string };
      }>;
    };
    return (
      parsed.choices?.[0]?.delta?.content ??
      parsed.choices?.[0]?.message?.content ??
      ""
    );
  } catch {
    return "";
  }
}

export async function streamChatCompletion(response: Response, onToken: TokenHandler) {
  if (!response.body) {
    throw new Error("响应没有可读取的流");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const token = extractDelta(line);
      if (token) {
        fullText += token;
        onToken(token);
      }
    }
  }

  const tail = extractDelta(buffer);
  if (tail) {
    fullText += tail;
    onToken(tail);
  }

  return fullText;
}
