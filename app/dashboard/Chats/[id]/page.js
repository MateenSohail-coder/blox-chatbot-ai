"use client";

import { UseAuth } from "@/context/AuthContext";
import axios from "axios";
import { Loader, Send, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import CodeBlock from "@/components/CodeBlock";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Animated User Bubble ───────────────────────────────────────────────
function UserBubble({ content }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = content.length > 350;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-end w-full mb-4 px-4 md:px-0"
    >
      <div className=" text-white max-w-[85%] md:max-w-[70%] rounded-lg p-2 font-mono text-base break-words border border-border dark:border-neutral-800 bg-blue-600 shadow-sm">
        <div
          className={
            !isExpanded && isLongText ? "line-clamp-4 overflow-hidden" : ""
          }
        >
          {content}
        </div>
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mountaineer text-xs text-muted-foreground hover:text-foreground mt-2 font-sans font-bold transition-colors"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show more <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Animated Assistant Bubble ─────────────────────────────────────────
function AssistantBubble({ content, streaming = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-start w-full mb-4 px-4 md:px-0"
    >
      <div className="border-b border-border dark:border-neutral-900 text-foreground w-full font-mono p-4 prose prose-neutral dark:prose-invert max-w-none text-base">
        <ReactMarkdown
          components={{
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeValue = String(children).replace(/\n$/, "");

              if (!inline && match) {
                return (
                  <CodeBlock
                    language={match[1]}
                    value={codeValue}
                    isStreaming={streaming}
                  />
                );
              }
              return (
                <code className="bg-muted text-foreground rounded-xs px-1.5 py-0.5 text-sm font-semibold border border-border dark:bg-neutral-900 dark:border-neutral-800">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
        {streaming && (
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 rounded-xs align-middle" />
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Chat View ──────────────────────────────────────────────────────
export default function ChatPage() {
  const params = useParams();
  const id = params?.id;

  const { reloadData } = UseAuth();
  const [messages, setMessages] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const textareaRef = useRef(null);

  // Auto-resize logic that handles growth and hides scrollbars dynamically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate correct scrollHeight
    textarea.style.height = "auto";

    // Set new height based on content, clamped between ~40px (1 line) and ~140px (5 lines)
    const nextHeight = Math.min(textarea.scrollHeight, 140);
    textarea.style.height = `${nextHeight}px`;
  }, [inputValue]);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    if (!id) return;

    async function fetchMessages() {
      try {
        const res = await axios.get(
          `/api/Conversation/messages?conversation_id=${id}`,
        );
        setMessages(res.data.messages ?? []);
      } catch (err) {
        toast.error("Failed to load conversation history.");
        setMessages([]);
      }
    }

    fetchMessages();

    return () => {
      abortRef.current?.abort();
    };
  }, [id]);

  const streamAssistantResponse = useCallback(
    async (conversationId, content, currentMessages) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsStreaming(true);
      setStreamingContent("");

      try {
        const res = await fetch("/api/Conversation/messages/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation_id: conversationId, content }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch {
              continue;
            }

            if (parsed.error) {
              toast.error(
                parsed.message || "An error occurred during streaming.",
              );
              break;
            }

            if (parsed.delta) {
              accumulated += parsed.delta;
              setStreamingContent(accumulated);
            }

            if (parsed.done) {
              setMessages((prev) => [
                ...(prev ?? currentMessages),
                { role: "assistant", content: accumulated },
              ]);
              setStreamingContent("");
              reloadData?.();
            }
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Stream connection dropped.");
          setMessages((prev) => [
            ...(prev ?? currentMessages),
            {
              role: "assistant",
              content: "⚠️ Something went wrong. Please try again.",
            },
          ]);
          setStreamingContent("");
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [reloadData],
  );

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;

    setInputValue("");
    const withUser = [...(messages ?? []), { role: "user", content: trimmed }];
    setMessages(withUser);

    await streamAssistantResponse(id, trimmed, withUser);
  }

  const isLoadingFromDB = messages === null;

  return (
    <div className="absolute overflow-hidden max-h-screen inset-0 flex flex-col justify-between bg-background text-foreground dark:bg-black">
      {/* Scrollable Container */}
      <ScrollArea ref={scrollRef} className="flex-1 h-[calc(100vh-140px)]">
        <div className="w-screen md:w-full  mx-auto px-3 sm:px-4 py-6 pb-15">
          {isLoadingFromDB ? (
            <LoadingState />
          ) : (
            <>
              <AnimatePresence initial={false}>
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <UserBubble key={i} content={msg.content} />
                  ) : (
                    <AssistantBubble key={i} content={msg.content} />
                  ),
                )}
              </AnimatePresence>

              {isStreaming && streamingContent && (
                <AssistantBubble content={streamingContent} streaming />
              )}

              {isStreaming && !streamingContent && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono px-4 py-4">
                  <Loader size={15} className="animate-spin" />
                  <span>blox is thinking…</span>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Floating ChatGPT / Gemini Style Deck */}
      <div className="w-full sticky bottom-0 mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent shrink-0 backdrop-blur-sm">
        <div className="relative flex flex-col gap-2 md:w-[80%] mx-auto border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/90 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all p-2 shadow-xl hover:shadow-2xl">
          {/* Top Section: Wrapped in Shadcn ScrollArea */}
          <div className="flex items-end gap-3 w-full pl-2 pr-1 pt-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything..."
              disabled={isStreaming || isLoadingFromDB}
              // Notice 'overflow-hidden': this stops the native browser scrollbar from ever appearing
              className="w-full min-h-[40px] bg-transparent resize-none py-2.5 text-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-sans text-neutral-900 dark:text-neutral-100 leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed "
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming || isLoadingFromDB}
              className="rounded-xl h-9 w-9 shrink-0 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600 transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:cursor-not-allowed mb-0.5"
            >
              {isStreaming ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Bottom Section: Model Dropdown Selector */}
          <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/60 pt-2 px-2">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-all cursor-pointer"
              >
                <Sparkles size={13} className="text-blue-500" />
                <span>{selectedModel}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute bottom-full space-y-1 left-0 mb-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 z-20 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150">
                    {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"].map(
                      (model) => (
                        <button
                          key={model}
                          onClick={() => {
                            setSelectedModel(model);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                            selectedModel === model
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                          }`}
                        >
                          {model}
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>

            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 select-none pr-1">
              {inputValue.length > 0 && `${inputValue.length} chars`}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-center text-neutral-400 dark:text-neutral-500 font-sans mt-3">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="md:w-full w-screen mx-auto px-4 py-6 space-y-6">
      {/* Assistant Message */}
      <div className="flex justify-start">
        <div className="w-full max-w-[85%] space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* User Message */}
      <div className="flex justify-end">
        <div className="w-full max-w-[70%] space-y-2">
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>

      {/* Assistant Message */}
      <div className="flex justify-start">
        <div className="w-full max-w-[85%] space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* User Message */}
      <div className="flex justify-end">
        <div className="w-full max-w-[60%]">
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>

      {/* Assistant Message */}
      <div className="flex justify-start">
        <div className="w-full max-w-[85%] space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
}
