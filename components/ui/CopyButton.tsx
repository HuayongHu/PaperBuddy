"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "./Button";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  disabled?: boolean;
}

export function CopyButton({
  text,
  label = "复制",
  copiedLabel = "已复制",
  disabled = false
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      disabled={disabled || !text}
      icon={copied ? <Check size={16} /> : <Copy size={16} />}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
