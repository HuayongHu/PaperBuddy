"use client";

import { useCallback, useEffect, useState } from "react";

import { PDF_CHATS_KEY, limitPDFChats, readJSON, writeJSON } from "@/lib/storage";
import type { PDFChatRecord } from "@/types/storage";

export function usePDFChats() {
  const [records, setRecords] = useState<PDFChatRecord[]>([]);

  useEffect(() => {
    setRecords(limitPDFChats(readJSON<PDFChatRecord[]>(PDF_CHATS_KEY, [])));
  }, []);

  const persist = useCallback((nextRecords: PDFChatRecord[]) => {
    const limited = limitPDFChats(nextRecords);
    setRecords(limited);
    writeJSON(PDF_CHATS_KEY, limited);
  }, []);

  const saveRecord = useCallback(
    (record: PDFChatRecord) => {
      persist([record, ...records.filter((item) => item.filename !== record.filename)]);
    },
    [records, persist]
  );

  const deleteRecord = useCallback(
    (filename: string) => {
      persist(records.filter((item) => item.filename !== filename));
    },
    [records, persist]
  );

  return { records, saveRecord, deleteRecord };
}
