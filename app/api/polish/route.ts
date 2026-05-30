import { callLLM, LLMConfigError } from "@/lib/llm";
import { jsonError } from "@/lib/http";
import { buildPolishSystemPrompt } from "@/lib/prompts";
import type { Language, PolishMode } from "@/types/polish";

export const runtime = "nodejs";
export const maxDuration = 60;

const POLISH_MODES: PolishMode[] = ["light", "academic", "rewrite"];
const LANGUAGES: Language[] = ["zh", "en", "auto"];

function isPolishMode(value: unknown): value is PolishMode {
  return typeof value === "string" && POLISH_MODES.includes(value as PolishMode);
}

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.includes(value as Language);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: unknown;
      mode?: unknown;
      language?: unknown;
    };

    if (typeof body.text !== "string" || !body.text.trim()) {
      return jsonError("缺少必要参数: text", "VALIDATION_ERROR", 400);
    }

    if (body.text.length > 10_000) {
      return jsonError("文本长度超出限制（最大 10000 字符）", "VALIDATION_ERROR", 400);
    }

    if (!isPolishMode(body.mode)) {
      return jsonError("缺少或不支持的润色模式", "VALIDATION_ERROR", 400);
    }

    const language = isLanguage(body.language) ? body.language : "auto";
    const upstream = await callLLM({
      systemPrompt: buildPolishSystemPrompt(body.mode, language),
      messages: [{ role: "user", content: body.text }],
      stream: true
    });

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    if (error instanceof LLMConfigError) {
      return jsonError("服务配置错误，请联系管理员", "CONFIG_ERROR", 500);
    }

    if (error instanceof DOMException && error.name === "TimeoutError") {
      return jsonError("AI 响应超时，请尝试缩短输入文本", "TIMEOUT", 504);
    }

    return jsonError("AI 服务暂时不可用，请稍后重试", "UPSTREAM_ERROR", 502);
  }
}
