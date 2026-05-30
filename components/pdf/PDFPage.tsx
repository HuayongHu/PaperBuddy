"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { streamChatCompletion } from "@/hooks/useStreaming";
import { usePDFChats } from "@/hooks/usePDFChats";
import { extractPDF, type ExtractedPDF } from "@/lib/pdfUtils";
import type { UIChatMessage } from "@/types/chat";
import type { PDFChatRecord } from "@/types/storage";

import { ChatWindow } from "./ChatWindow";
import { PDFViewer } from "./PDFViewer";
import { UploadZone } from "./UploadZone";

interface LoadedPDFState {
  filename: string;
  pageCount: number;
  text: string;
  originalLength: number;
  truncated: boolean;
  isTextEmpty: boolean;
  data: ArrayBuffer | null;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toLoadedState(pdf: ExtractedPDF): LoadedPDFState {
  return {
    filename: pdf.filename,
    pageCount: pdf.pageCount,
    text: pdf.text,
    originalLength: pdf.originalLength,
    truncated: pdf.truncated,
    isTextEmpty: pdf.isTextEmpty,
    data: pdf.data
  };
}

export function PDFPage() {
  const [loadedPDF, setLoadedPDF] = useState<LoadedPDFState | null>(null);
  const [messages, setMessages] = useState<UIChatMessage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");
  const [chatError, setChatError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { records, saveRecord, deleteRecord } = usePDFChats();

  const showQuickQuestions = useMemo(
    () => messages.filter((message) => message.role === "user").length === 0,
    [messages]
  );

  async function handleFile(file: File) {
    setError("");
    setChatError("");

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("该文件不是有效的 PDF 格式，请重新选择");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("文件大小超过 20MB 限制，请压缩后重试");
      return;
    }

    setProcessing(true);
    setProgressText("正在提取文本内容，请稍候...");

    try {
      const extracted = await extractPDF(file);
      const nextPDF = toLoadedState(extracted);
      setLoadedPDF(nextPDF);
      setMessages([]);
      saveRecord({
        filename: nextPDF.filename,
        lastAccessed: Date.now(),
        pageCount: nextPDF.pageCount,
        extractedText: nextPDF.text,
        messages: []
      });
    } catch {
      setError("PDF 文本提取失败，请重新选择文件或尝试其他 PDF");
    } finally {
      setProcessing(false);
      setProgressText("");
    }
  }

  function persistMessages(nextMessages: UIChatMessage[], pdf = loadedPDF) {
    if (!pdf) {
      return;
    }

    saveRecord({
      filename: pdf.filename,
      lastAccessed: Date.now(),
      pageCount: pdf.pageCount,
      extractedText: pdf.text,
      messages: nextMessages
    });
  }

  async function ask(question: string) {
    if (!loadedPDF || isLoading) {
      return;
    }

    const userMessage: UIChatMessage = {
      id: createId(),
      role: "user",
      content: question,
      timestamp: Date.now()
    };
    const assistantMessage: UIChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
      timestamp: Date.now()
    };
    const baseMessages = [...messages, userMessage, assistantMessage];

    setMessages(baseMessages);
    setChatError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfContent: loadedPDF.text,
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`服务暂时不可用（错误码: ${response.status}），请稍后重试`);
      }

      let collected = "";
      await streamChatCompletion(response, (token) => {
        collected += token;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + token }
              : message
          )
        );
      });

      const finalMessages = baseMessages.map((message) =>
        message.id === assistantMessage.id ? { ...message, content: collected } : message
      );
      setMessages(finalMessages);
      persistMessages(finalMessages);
    } catch (caught) {
      setChatError(caught instanceof Error ? caught.message : "网络连接失败，请检查网络后重试");
      setMessages(baseMessages.filter((message) => message.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
    }
  }

  function restore(record: PDFChatRecord) {
    setLoadedPDF({
      filename: record.filename,
      pageCount: record.pageCount,
      text: record.extractedText,
      originalLength: record.extractedText.length,
      truncated: record.extractedText.length >= 60_000,
      isTextEmpty: record.extractedText.length === 0,
      data: null
    });
    setMessages(record.messages);
    setError("");
    setChatError("");
  }

  function resetUpload() {
    setLoadedPDF(null);
    setMessages([]);
    setError("");
    setChatError("");
  }

  if (!loadedPDF) {
    return (
      <UploadZone
        isProcessing={processing}
        error={error}
        progressText={progressText}
        history={records}
        onFileSelected={handleFile}
        onRestore={restore}
        onDeleteHistory={deleteRecord}
      />
    );
  }

  return (
    <main className="workspace-page pdf-workspace">
      <div className="pdf-topbar">
        <Button
          type="button"
          variant="ghost"
          onClick={resetUpload}
          icon={<ArrowLeft size={16} />}
        >
          返回
        </Button>
        <strong>{loadedPDF.filename}</strong>
        <Button
          type="button"
          variant="secondary"
          onClick={resetUpload}
          icon={<RotateCcw size={16} />}
        >
          重新上传
        </Button>
      </div>
      <p className="mobile-preview-note">PDF 预览在大屏设备上可见。</p>
      <div className="split-layout pdf-layout">
        <PDFViewer
          data={loadedPDF.data}
          filename={loadedPDF.filename}
          pageCount={loadedPDF.pageCount}
        />
        <ChatWindow
          filename={loadedPDF.filename}
          pageCount={loadedPDF.pageCount}
          textLength={loadedPDF.originalLength}
          truncated={loadedPDF.truncated}
          isTextEmpty={loadedPDF.isTextEmpty}
          messages={messages}
          isLoading={isLoading}
          error={chatError}
          showQuickQuestions={showQuickQuestions}
          onAsk={ask}
          onRetry={() => {
            const lastUser = [...messages].reverse().find((message) => message.role === "user");
            if (lastUser) {
              ask(lastUser.content);
            }
          }}
        />
      </div>
    </main>
  );
}
