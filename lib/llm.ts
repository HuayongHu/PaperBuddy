import type { ChatMessage } from "@/types/chat";

type ReasoningEffort = "low" | "medium" | "high";

export interface LLMCallOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  stream: true;
}

export interface LLMRuntimeOptions {
  fetcher?: typeof fetch;
  env?: Record<string, string | undefined>;
}

interface LLMPayloadOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  modelId: string;
  maxTokens: number;
  reasoningEffort: ReasoningEffort;
}

export class LLMConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMConfigError";
  }
}

export class LLMUpstreamError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "LLMUpstreamError";
    this.status = status;
  }
}

export function createLLMPayload(options: LLMPayloadOptions) {
  return {
    model: options.modelId,
    messages: options.systemPrompt
      ? [{ role: "system" as const, content: options.systemPrompt }, ...options.messages]
      : options.messages,
    stream: true,
    max_tokens: options.maxTokens,
    reasoning_effort: options.reasoningEffort
  };
}

function resolveEndpoint(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/chat/completions")) {
    return trimmed;
  }

  return `${trimmed}/chat/completions`;
}

function normalizeReasoningEffort(value: string | undefined): ReasoningEffort {
  return value === "low" || value === "medium" || value === "high" ? value : "high";
}

function parseMaxTokens(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 4096;
}

export async function callLLM(
  options: LLMCallOptions,
  runtime: LLMRuntimeOptions = {}
): Promise<Response> {
  const env = runtime.env ?? process.env;
  const fetcher = runtime.fetcher ?? fetch;
  const apiKey = env.LLM_API_KEY;

  if (!apiKey) {
    throw new LLMConfigError("LLM_API_KEY is not configured");
  }

  const baseUrl = env.LLM_API_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
  const modelId = env.LLM_MODEL_ID ?? "openai/gpt-oss-120b";
  const payload = createLLMPayload({
    messages: options.messages,
    systemPrompt: options.systemPrompt,
    modelId,
    maxTokens: parseMaxTokens(env.LLM_MAX_TOKENS),
    reasoningEffort: normalizeReasoningEffort(env.LLM_THINKING_INTENSITY)
  });

  const response = await fetcher(resolveEndpoint(baseUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60_000)
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new LLMUpstreamError(response.status, detail || response.statusText);
  }

  return response;
}
