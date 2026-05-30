import type { PolishRecord } from "@/types/polish";
import type { PDFChatRecord } from "@/types/storage";

export const POLISH_HISTORY_KEY = "polish_history";
export const PDF_CHATS_KEY = "pdf_chats";

export function createPolishRecord(record: PolishRecord): PolishRecord {
  return record;
}

export function limitPolishHistory(records: PolishRecord[]): PolishRecord[] {
  return [...records]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
}

export function limitPDFChats(records: PDFChatRecord[]): PDFChatRecord[] {
  return [...records]
    .map((record) => ({
      ...record,
      messages:
        record.messages.length > 100
          ? record.messages.slice(record.messages.length - 80)
          : record.messages
    }))
    .sort((a, b) => b.lastAccessed - a.lastAccessed)
    .slice(0, 5);
}

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can fail in private mode or when quota is exhausted.
  }
}
