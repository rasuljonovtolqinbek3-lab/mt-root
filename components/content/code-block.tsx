"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "code" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-surface-hover px-3 py-1.5 border-b border-border">
        <span className="text-[10px] font-mono uppercase text-text-muted">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-background-secondary p-4 overflow-x-auto">
        <code className="font-mono text-sm text-text-secondary whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
