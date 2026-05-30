import type { UIChatMessage } from "./chat";

export interface PDFChatRecord {
  filename: string;
  lastAccessed: number;
  pageCount: number;
  extractedText: string;
  messages: UIChatMessage[];
}
