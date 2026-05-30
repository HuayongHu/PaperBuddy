"use client";

import type { UIChatMessage } from "@/types/chat";

interface ChatMessageProps {
  message: UIChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <article className={`chat-message ${message.role}`}>
      <div className="chat-bubble">
        {message.content.split("\n").map((line, index) => (
          <p key={`${line}-${index}`}>{line || "\u00a0"}</p>
        ))}
      </div>
    </article>
  );
}
