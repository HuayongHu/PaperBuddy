import { callLLM, LLMConfigError } from "@/lib/llm";
import { jsonError } from "@/lib/http";
import { buildChatSystemPrompt } from "@/lib/prompts";
import type { ChatMessage } from "@/types/chat";

export const runtime = "nodejs";
export const maxDuration = 60;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ChatMessage>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: unknown;
      pdfContent?: unknown;
    };

    if (!Array.isArray(body.messages)) {
      return jsonError("缺少必要参数: messages", "VALIDATION_ERROR", 400);
    }

    if (body.messages.length > 200) {
      return jsonError("对话历史过长，请开启新的文献对话", "VALIDATION_ERROR", 400);
    }

    if (!body.messages.every(isChatMessage)) {
      return jsonError("messages 参数格式不正确", "VALIDATION_ERROR", 400);
    }

    if (typeof body.pdfContent !== "string") {
      return jsonError("缺少必要参数: pdfContent", "VALIDATION_ERROR", 400);
    }

    if (body.pdfContent.length > 60_000) {
      return jsonError("PDF 文本长度超出限制（最大 60000 字符）", "VALIDATION_ERROR", 400);
    }

    const upstream = await callLLM({
      systemPrompt: buildChatSystemPrompt(body.pdfContent),
      messages: body.messages,
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
