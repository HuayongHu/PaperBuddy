"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { normalizeAssistantMarkdown } from "@/lib/normalizeAssistantMarkdown";
import type { UIChatMessage } from "@/types/chat";

interface ChatMessageProps {
  message: UIChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const content = isAssistant
    ? normalizeAssistantMarkdown(message.content || " ")
    : message.content;

  return (
    <article className={`chat-message ${message.role}`}>
      <div className="chat-bubble">
        {isAssistant ? (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          content.split("\n").map((line, index) => (
            <p key={`${line}-${index}`}>{line || "\u00a0"}</p>
          ))
        )}
      </div>
    </article>
  );
}
