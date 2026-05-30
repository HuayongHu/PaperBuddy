"use client";

import { SendHorizontal } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  disabled: boolean;
  onSend: (message: string) => void;
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    setValue("");
    onSend(trimmed);
  }

  return (
    <form className="chat-input" onSubmit={submit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="输入问题..."
        aria-label="输入文献问题"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        aria-label="发送问题"
        disabled={!value.trim() || disabled}
        icon={<SendHorizontal size={18} />}
      />
    </form>
  );
}
