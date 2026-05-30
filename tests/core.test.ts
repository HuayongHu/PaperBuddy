import { describe, expect, it, vi } from "vitest";

import { detectLanguage } from "@/lib/detectLanguage";
import { buildChatSystemPrompt, buildPolishSystemPrompt } from "@/lib/prompts";
import { callLLM, createLLMPayload } from "@/lib/llm";
import { normalizeAssistantMarkdown } from "@/lib/normalizeAssistantMarkdown";
import { parsePolishResult } from "@/lib/parsePolishResult";
import {
  createPolishRecord,
  limitPDFChats,
  limitPolishHistory
} from "@/lib/storage";

describe("detectLanguage", () => {
  it("detects Chinese text when Chinese characters dominate", () => {
    expect(detectLanguage("本文提出一种面向学术写作的自动润色方法。")).toBe("zh");
  });

  it("detects English text when latin words dominate", () => {
    expect(
      detectLanguage("This paper proposes a robust method for academic writing assistance.")
    ).toBe("en");
  });

  it("falls back to auto for empty or ambiguous text", () => {
    expect(detectLanguage(" 12345 ... ")).toBe("auto");
  });
});

describe("parsePolishResult", () => {
  it("parses completed paragraph blocks and keeps incomplete text separately", () => {
    const raw = [
      "---PARA_START---",
      "【原文】",
      "原文一",
      "",
      "【中文翻译】",
      "中文翻译一",
      "",
      "【问题分析】",
      "- 问题一",
      "- 问题二",
      "",
      "【润色结果】",
      "结果一",
      "",
      "【润色后中文翻译】",
      "润色后中文翻译一",
      "---PARA_END---",
      "---PARA_START---",
      "【原文】",
      "尚未完成"
    ].join("\n");

    const parsed = parsePolishResult(raw);

    expect(parsed.blocks).toEqual([
      {
        original: "原文一",
        chineseTranslation: "中文翻译一",
        analysis: ["问题一", "问题二"],
        polished: "结果一",
        polishedChineseTranslation: "润色后中文翻译一"
      }
    ]);
    expect(parsed.pending).toContain("尚未完成");
  });

  it("accepts analysis text even when bullets are omitted", () => {
    const raw = [
      "---PARA_START---",
      "【原文】",
      "Original",
      "【中文翻译】",
      "原文中文翻译",
      "【问题分析】",
      "No issues.",
      "【润色结果】",
      "Polished",
      "【润色后中文翻译】",
      "润色中文翻译",
      "---PARA_END---"
    ].join("\n");

    expect(parsePolishResult(raw).blocks[0].analysis).toEqual(["No issues."]);
    expect(parsePolishResult(raw).blocks[0].chineseTranslation).toBe("原文中文翻译");
  });
});

describe("normalizeAssistantMarkdown", () => {
  it("turns model-emitted html breaks into markdown line breaks and lists", () => {
    const raw =
      "采用 OTFS 调制；<br>- 在 DD 域建模路径损耗。<br>- 支持物理层安全。";

    expect(normalizeAssistantMarkdown(raw)).toBe(
      ["采用 OTFS 调制；", "- 在 DD 域建模路径损耗。", "- 支持物理层安全。"].join(
        "\n"
      )
    );
  });

  it("turns standalone bracketed latex blocks into display math", () => {
    const raw = [
      "公式编号为 (6)",
      "[",
      "\\gamma_{k,l,i}[n];=;\\frac{P_{k,l}[n];\\alpha_{k,l,i}[n]}{\\sigma^{2}},\\qquad i\\in{b,e}",
      "]"
    ].join("\n");

    expect(normalizeAssistantMarkdown(raw)).toBe(
      [
        "公式编号为 (6)",
        "$$",
        "\\gamma_{k,l,i}[n] = \\frac{P_{k,l}[n] \\alpha_{k,l,i}[n]}{\\sigma^{2}},\\qquad i\\in{b,e}",
        "$$"
      ].join("\n")
    );
  });
});

describe("storage helpers", () => {
  it("keeps only the latest 10 polish records", () => {
    const records = Array.from({ length: 12 }, (_, index) =>
      createPolishRecord({
        id: `record-${index}`,
        timestamp: index,
        mode: "light",
        language: "zh",
        inputText: `input ${index}`,
        result: `result ${index}`
      })
    );

    const limited = limitPolishHistory(records);

    expect(limited).toHaveLength(10);
    expect(limited[0].id).toBe("record-11");
    expect(limited.at(-1)?.id).toBe("record-2");
  });

  it("keeps only the latest 5 PDF chat records", () => {
    const chats = Array.from({ length: 7 }, (_, index) => ({
      filename: `paper-${index}.pdf`,
      lastAccessed: index,
      pageCount: 3,
      extractedText: `paper ${index}`,
      messages: []
    }));

    const limited = limitPDFChats(chats);

    expect(limited).toHaveLength(5);
    expect(limited.map((item) => item.filename)).toEqual([
      "paper-6.pdf",
      "paper-5.pdf",
      "paper-4.pdf",
      "paper-3.pdf",
      "paper-2.pdf"
    ]);
  });
});

describe("prompts", () => {
  it("injects polishing mode and language without extra placeholders", () => {
    const prompt = buildPolishSystemPrompt("academic", "en");

    expect(prompt).toContain("学术加强");
    expect(prompt).toContain("论文语言为：英文");
    expect(prompt).toContain("【中文翻译】");
    expect(prompt).toContain("【润色后中文翻译】");
    expect(prompt).not.toContain("{{");
  });

  it("embeds PDF content inside the chat system prompt", () => {
    const prompt = buildChatSystemPrompt("Abstract text");

    expect(prompt).toContain("===== 论文全文开始 =====");
    expect(prompt).toContain("Abstract text");
    expect(prompt).toContain("===== 论文全文结束 =====");
  });
});

describe("LLM payload", () => {
  it("uses NVIDIA-compatible chat completion fields", () => {
    const payload = createLLMPayload({
      messages: [{ role: "user", content: "hello" }],
      systemPrompt: "system",
      modelId: "openai/gpt-oss-120b",
      maxTokens: 2048,
      reasoningEffort: "high"
    });

    expect(payload).toMatchObject({
      model: "openai/gpt-oss-120b",
      stream: true,
      max_tokens: 2048,
      reasoning_effort: "high"
    });
    expect(payload.messages[0]).toEqual({ role: "system", content: "system" });
  });

  it("posts to /chat/completions without duplicating the suffix", async () => {
    const response = new Response("data: [DONE]\n\n", {
      status: 200,
      headers: { "Content-Type": "text/event-stream" }
    });
    const fetchMock = vi.fn().mockResolvedValue(response);

    await callLLM(
      {
        messages: [{ role: "user", content: "hello" }],
        systemPrompt: "system",
        stream: true
      },
      {
        fetcher: fetchMock,
        env: {
          LLM_API_BASE_URL: "https://integrate.api.nvidia.com/v1",
          LLM_API_KEY: "secret",
          LLM_MODEL_ID: "openai/gpt-oss-120b",
          LLM_THINKING_INTENSITY: "high",
          LLM_MAX_TOKENS: "4096"
        }
      }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer secret",
          "Content-Type": "application/json"
        })
      })
    );
  });
});
