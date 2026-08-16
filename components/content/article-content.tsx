"use client";

/**
 * ArticleContent Component
 * 
 * SECURITY NOTE: The `content` prop passed to this component MUST be
 * pre-sanitized server-side using `sanitizeHtml()` from `@/lib/sanitize`.
 * This component uses `dangerouslySetInnerHTML` for rich content rendering.
 * Never pass raw user input directly to this component.
 * 
 * The server-side sanitizer uses a strict whitelist approach:
 * - Only specific HTML tags are allowed (no script, style, iframe, object, embed)
 * - Only specific attributes are allowed per tag
 * - Event handlers (on*) are stripped
 * - javascript: URLs are blocked
 * - Only http/https/mailto/tel URL schemes are allowed
 */

import { useEffect, useRef } from "react";
import { CodeBlock } from "./code-block";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Find all code blocks and enhance them
    const codeBlocks = containerRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      if (!pre) return;
      const code = block.textContent || "";
      const lang = block.className.match(/language-(\w+)/)?.[1] || "";

      // Replace with our CodeBlock component via DOM manipulation
      const wrapper = document.createElement("div");
      wrapper.className = "my-4";

      const header = document.createElement("div");
      header.className = "flex items-center justify-between rounded-t-lg bg-surface-hover border border-border px-3 py-1.5";

      const langLabel = document.createElement("span");
      langLabel.className = "text-[10px] font-mono uppercase text-text-muted";
      langLabel.textContent = lang || "code";

      const copyBtn = document.createElement("button");
      copyBtn.className = "text-[10px] text-text-muted hover:text-primary transition-colors";
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(code);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
      };

      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      const codeEl = document.createElement("pre");
      codeEl.className = "rounded-b-lg bg-background-secondary border-x border-b border-border p-4 overflow-x-auto";
      const innerCode = document.createElement("code");
      innerCode.className = "font-mono text-sm text-text-secondary whitespace-pre";
      innerCode.textContent = code;
      codeEl.appendChild(innerCode);

      wrapper.appendChild(header);
      wrapper.appendChild(codeEl);

      pre.parentNode?.replaceChild(wrapper, pre);
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="prose prose-invert prose-sm sm:prose-base max-w-none
        prose-headings:text-text-primary prose-headings:font-semibold
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        prose-p:text-text-secondary prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-text-primary
        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-transparent prose-pre:p-0
        prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        prose-ul:text-text-secondary prose-ol:text-text-secondary
        prose-li:marker:text-text-muted
        prose-table:border-border prose-th:text-text-primary prose-th:bg-surface prose-td:text-text-secondary
        prose-hr:border-border"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
