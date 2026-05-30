"use client";

import { useState } from "react";

import { detectLanguage } from "@/lib/detectLanguage";
import { streamChatCompletion } from "@/hooks/useStreaming";
import { usePolishHistory } from "@/hooks/usePolishHistory";
import type { Language, PolishMode, PolishRecord } from "@/types/polish";

import { PolishHistory } from "./PolishHistory";
import { ResultPanel } from "./ResultPanel";
import { TextInputPanel } from "./TextInputPanel";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function PolishPage() {
  const [mode, setMode] = useState<PolishMode>("light");
  const [text, setText] = useState("");
  const [rawResult, setRawResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [interrupted, setInterrupted] = useState(false);
  const { history, saveRecord, deleteRecord } = usePolishHistory();

  async function submit(currentText = text, currentMode = mode) {
    const trimmed = currentText.trim();
    if (!trimmed || trimmed.length > 2000 || isLoading) {
      return;
    }

    setRawResult("");
    setError("");
    setInterrupted(false);
    setIsLoading(true);
    const language: Language = detectLanguage(trimmed);

    try {
      const response = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, mode: currentMode, language })
      });

      if (!response.ok) {
        throw new Error(`服务暂时不可用（错误码: ${response.status}），请稍后重试`);
      }

      let collected = "";
      await streamChatCompletion(response, (token) => {
        collected += token;
        setRawResult((value) => value + token);
      });

      if (!collected.trim()) {
        throw new Error("模型未返回有效内容，请尝试修改输入后重试");
      }

      saveRecord({
        id: createId(),
        timestamp: Date.now(),
        mode: currentMode,
        language,
        inputText: trimmed,
        result: collected
      });
    } catch (caught) {
      setInterrupted(rawResult.length > 0);
      setError(caught instanceof Error ? caught.message : "网络连接失败，请检查网络后重试");
    } finally {
      setIsLoading(false);
    }
  }

  function clearAll() {
    if (!text && !rawResult) {
      return;
    }

    if (window.confirm("确定清空当前输入和润色结果吗？")) {
      setText("");
      setRawResult("");
      setError("");
      setInterrupted(false);
    }
  }

  function restore(record: PolishRecord) {
    setText(record.inputText);
    setMode(record.mode);
    setRawResult(record.result);
    setError("");
    setInterrupted(false);
  }

  return (
    <main className="workspace-page">
      <div className="page-heading">
        <h1>论文润色</h1>
        <p>粘贴论文片段，按自然段查看问题分析和修改后的学术表达。</p>
      </div>

      <div className="split-layout polish-layout">
        <aside className="left-panel">
          <TextInputPanel
            mode={mode}
            text={text}
            isLoading={isLoading}
            onModeChange={setMode}
            onTextChange={setText}
            onSubmit={() => submit()}
            onClear={clearAll}
          />
          <PolishHistory records={history} onRestore={restore} onDelete={deleteRecord} />
        </aside>
        <ResultPanel
          rawResult={rawResult}
          isLoading={isLoading}
          error={error}
          interrupted={interrupted}
          onRetry={() => submit()}
        />
      </div>
    </main>
  );
}
