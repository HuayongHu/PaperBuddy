export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface UIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
