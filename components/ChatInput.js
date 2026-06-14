"use client";

import { memo, useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send } from "lucide-react";

/**
 * ChatInput Component
 * Provides an auto-growing textarea with a send button
 * Styled to match ChatGPT design
 */
const ChatInput = memo(function ChatInput({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = "Message Blox...",
}) {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend();
    }
  };

  const isSendDisabled = !value.trim() || isLoading;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-4">
      <div
        className={`
          relative rounded-lg border transition-all duration-200
          ${
            isFocused
              ? "border-emerald-500 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5"
              : "border-slate-300 dark:border-slate-700 shadow-md"
          }
          bg-white dark:bg-slate-900 overflow-hidden
        `}
      >
        <div className="flex items-end gap-3 p-3">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            className="
              flex-1 resize-none border-0 focus:ring-0 p-0
              text-sm text-slate-900 dark:text-slate-50
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              bg-transparent
              max-h-48 overflow-y-auto
            "
            rows={1}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSend}
                  disabled={isSendDisabled}
                  className={`
                    flex-shrink-0 h-9 w-9 p-0 rounded-lg
                    transition-all duration-200
                    ${
                      isSendDisabled
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
                    }
                  `}
                >
                  <Send size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isLoading ? "Sending..." : "Send (Ctrl+Enter)"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Bottom hint text */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
              Ctrl+Enter
            </kbd>{" "}
            to send
          </p>
        </div>
      </div>
    </div>
  );
});

export default ChatInput;
