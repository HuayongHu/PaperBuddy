"use client";

import { useCallback, useEffect, useState } from "react";

import {
  POLISH_HISTORY_KEY,
  limitPolishHistory,
  readJSON,
  writeJSON
} from "@/lib/storage";
import type { PolishRecord } from "@/types/polish";

export function usePolishHistory() {
  const [history, setHistory] = useState<PolishRecord[]>([]);

  useEffect(() => {
    setHistory(limitPolishHistory(readJSON<PolishRecord[]>(POLISH_HISTORY_KEY, [])));
  }, []);

  const persist = useCallback((records: PolishRecord[]) => {
    const limited = limitPolishHistory(records);
    setHistory(limited);
    writeJSON(POLISH_HISTORY_KEY, limited);
  }, []);

  const saveRecord = useCallback(
    (record: PolishRecord) => {
      persist([record, ...history.filter((item) => item.id !== record.id)]);
    },
    [history, persist]
  );

  const deleteRecord = useCallback(
    (id: string) => {
      persist(history.filter((item) => item.id !== id));
    },
    [history, persist]
  );

  return { history, saveRecord, deleteRecord };
}
