// components/CodeBlock.jsx
"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

const THEME_OVERRIDES = {
  'pre[class*="language-"]': {
    margin: 0,
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
    lineHeight: "1.6",
    padding: "1rem",
    overflowX: "auto",
    background: "transparent",
  },
  'code[class*="language-"]': {
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
    fontSize: "0.875rem",
  },
};

const mergedTheme = Object.fromEntries(
  Object.entries(tomorrow).map(([k, v]) => [
    k,
    { ...v, ...(THEME_OVERRIDES[k] ?? {}) },
  ]),
);

export default function CodeBlock({ language, value, isStreaming }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("copied to clipboard !", { position: "bottom-right" });
    });
  }

  return (
    <div className="relative my-4 rounded-sm overflow-hidden border border-border bg-muted/50 dark:bg-neutral-950 dark:border-neutral-900 group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted text-muted-foreground text-xs font-mono border-b border-border dark:bg-neutral-900 dark:border-neutral-800">
        <span className="truncate">{language || "code"}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <Check size={13} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Body */}
      {isStreaming ? (
        <pre className="m-0 p-4 bg-transparent text-foreground text-sm leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap break-words rounded-b-sm">
          {value}
        </pre>
      ) : (
        <div className="rounded-b-sm bg-neutral-950 text-neutral-50 dark:bg-black">
          <SyntaxHighlighter
            style={mergedTheme}
            language={language || "text"}
            PreTag="div"
            wrapLongLines
          >
            {value}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
