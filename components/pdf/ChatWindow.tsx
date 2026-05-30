"use client";

import { Bot, FileText } from "lucide-react";
import { useEffect, useRef } from "react";

import { ErrorBanner } from "@/components/ui/ErrorBanner";
import type { UIChatMessage } from "@/types/chat";

import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { QuickQuestions } from "./QuickQuestions";

interface ChatWindowProps {
  filename: string;
  pageCount: number;
  textLength: number;
  truncated: boolean;
  isTextEmpty: boolean;
  messages: UIChatMessage[];
  isLoading: boolean;
  error: string;
  showQuickQuestions: boolean;
  onAsk: (question: string) => void;
  onRetry: () => void;
}

export function ChatWindow({
  filename,
  pageCount,
  textLength,
  truncated,
  isTextEmpty,
  messages,
  isLoading,
  error,
  showQuickQuestions,
  onAsk,
  onRetry
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <section className="chat-panel" aria-label="PDF 智能对话">
      <div className="chat-scroll" ref={scrollRef}>
        <article className="assistant-welcome">
          <span className="welcome-icon">
            <Bot size={20} aria-hidden="true" />
          </span>
          <div>
            <h2>我已读取《{filename}》</h2>
            <p>
              共 {pageCount} 页，约 {textLength.toLocaleString("zh-CN")} 字。
              {truncated && " 文献较长，已自动截取前 60,000 字符进行分析。"}
            </p>
            {isTextEmpty ? (
              <p className="warning-note">
                该 PDF 可能为扫描版或图片型，文字提取失败。问答功能可能无法正常工作，但您仍可尝试提问。
              </p>
            ) : (
              <p className="muted">
                您可以询问核心研究问题、实验方法、主要结论或创新点。
              </p>
            )}
          </div>
        </article>

        {showQuickQuestions && !isTextEmpty && <QuickQuestions onAsk={onAsk} />}

        {messages.length === 0 && (
          <div className="chat-empty">
            <FileText size={28} aria-hidden="true" />
            <span>对话历史会显示在这里</span>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <div className="streaming-hint">AI 正在回答...</div>}
        {error && (
          <ErrorBanner
            message={error}
            action={
              <button type="button" className="inline-retry" onClick={onRetry}>
                重试
              </button>
            }
          />
        )}
      </div>
      <ChatInput disabled={isLoading} onSend={onAsk} />
    </section>
  );
}
