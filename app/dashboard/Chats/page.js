"use client";

import { UseAuth } from "@/context/AuthContext";
import axios from "axios";
import { ChevronDown, Loader, Send, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
// Import your Shadcn ScrollArea component
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedIcon from "@/components/sparkIcon";

export default function NewChat() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, settrigger2 } = UseAuth();
  const router = useRouter();
  const textareaRef = useRef(null);

  // Auto-resize the textarea element dynamically so it fills the ScrollArea container
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);

    try {
      // 1. Create conversation
      const convRes = await axios.post("/api/Conversation", {
        user_id: user.userId,
        title: trimmed.substring(0, 50),
        model: selectedModel, // Optional: tracking model in database
      });
      const conversationId = convRes.data.conversation._id;

      // 2. Save the user message
      await axios.post("/api/Conversation/messages", {
        conversation_id: conversationId,
        role: "user",
        content: trimmed,
      });
      (settrigger2((pre) => pre + 1),
        // 3. Reload sidebar so new chat appears
        // 4. Navigate — the [id] page will handle streaming the AI response
        router.push(`/dashboard/Chats/${conversationId}`));
    } catch (err) {
      console.error("Failed to create conversation:", err);
      toast.error("Could not initiate new conversation pipeline.");
      setSending(false);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-background text-foreground dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4 text-center relative overflow-visible select-none">
        {/* 3D Floating/Glowing Element Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-32 w-32 md:h-36 md:w-36 mb-8 flex items-center justify-center"
        >
          {/* Futuristic Outer Glow Ring (Adapts to light/dark mode) */}
          <div className="absolute inset-0 rounded-full bg-blue-600/20 dark:bg-blue-600/30 blur-xl animate-pulse" />

          {/* Rotating Orbital 3D Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-blue-600/40 dark:border-blue-500/30 rounded-full p-2"
          />
          <AnimatedIcon
            animation="flow"
            loop="infinite"
            color="#378ADD"
            size={120}
            speed={6}
          />
        </motion.div>

        {/* Futuristic Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-Gasoek md:text-5xl font-extralight text-neutral-800 dark:text-neutral-100"
        >
          How can I help you today,{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-500 dark:to-cyan-300 drop-shadow-[0_2px_10px_rgba(37,99,235,0.15)]">
            {user?.username || "there"}

            {/* Underline glow effect */}
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-blue-600/0 via-blue-500/50 to-cyan-500/0" />
          </span>
          <span className="text-blue-600 dark:text-blue-400 animate-pulse">
            _
          </span>
        </motion.h1>
      </div>

      {/* Centered Modern Floating Input Container */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 shrink-0">
        <div className="relative flex flex-col gap-2 border border-border rounded-2xl bg-muted/30 focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring transition-all p-2 dark:bg-neutral-950/40 dark:border-neutral-900 shadow-lg hover:shadow-xl">
          {/* Top Row: Input Field & Submit Button */}
          <div className="flex items-end gap-3 w-full pl-2 pr-1 pt-1">
            <ScrollArea className="flex-1 max-h-[140px] w-full pr-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message Blox..."
                disabled={sending}
                // 'overflow-hidden' prevents the native textarea component from throwing a duplicate scroll bar
                className="w-full min-h-[40px] bg-transparent resize-none py-2 text-base outline-none placeholder:text-muted-foreground/70 font-sans text-foreground leading-relaxed disabled:opacity-50 overflow-hidden"
                rows={1}
              />
            </ScrollArea>

            <button
              onClick={sendMessage}
              disabled={!message.trim() || sending}
              className="flex-shrink-0 h-9 w-9 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted dark:disabled:bg-neutral-900 disabled:text-muted-foreground/40 disabled:opacity-100 transition-all rounded-xl shadow-sm cursor-pointer disabled:cursor-not-allowed mb-0.5"
            >
              {sending ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Bottom Row: Custom Shadcn-styled Dropdown Controls */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2 px-1.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 dark:hover:bg-neutral-900/80 transition-all cursor-pointer"
              >
                <Sparkles
                  size={13}
                  className="text-blue-500 fill-blue-500/10"
                />
                <span>{selectedModel}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Selection Dropdown Modal Menu */}
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

            {/* Micro Character Counter UI */}
            <span className="text-[10px] text-muted-foreground/50 select-none pr-1">
              {message.length > 0 && `${message.length} chars`}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-center text-muted-foreground/60 font-sans mt-2.5">
          Blox can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
