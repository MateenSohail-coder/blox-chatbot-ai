"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
import { UseAuth } from "@/context/AuthContext";
export default function Chats() {
  const params = useParams(); // ← server wala params nahi chalega
  const id = params.id;
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const [loader, setloader] = useState(false);
  const [assistantloader, setassistantloader] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!id) {
    console.log("no id ");
  }
  useEffect(() => {
    if (!id) {
      return null;
    }
    async function getmessages() {
      setloader(true);
      try {
        const res = await axios.get(
          `/api/Conversation/messages?conversation_id=${id}`,
        );
        setmessages(res.data.messages);
      } catch {
        setmessages([]);
        console.log("somthing went wrong");
      } finally {
        setloader(false);
      }
    }
    getmessages();
  }, [id]);
  async function sendmessage() {
    setmessage("");
    setmessages((prev) => [...prev, { role: "user", content: message }]);
    setassistantloader(true);
    try {
      const res = await axios.post("/api/Conversation/messages", {
        conversation_id: id,
        role: "user",
        content: message,
      });
      const assistantmes = res.data.assistant.content;
      console.log(assistantmes);
      setmessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantmes },
      ]);
    } catch {
      console.log("somthing went wrong");
    } finally {
      setassistantloader(false);
    }
  }
  return (
    <div className="h-screen w-full py-10 overflow-hidden">
      <div className="h-[85%] w-screen md:w-full overflow-y-auto flex flex-col gap-3 p-4">
        {loader ? (
          <div className="h-[85%] w-full flex flex-col items-center justify-center">
            <div className="relative h-40 w-40  md:h-80 md:w-80">
              <Image
                src="/blox.png"
                alt="blox"
                fill={true}
                loading="eager"
                sizes="full"
                className="flutting h-full w-full"
              />
            </div>
            <div className="text-sm sm:text-2xl md:text-3xl font-mono flex items-center  text-amber-900  drop-shadow-[0_5px_10px_rgba(180,140,0,0.6)] tracking-wider leading-tight">
              <span className="bg-amber-950 text-amber-200 p-2 rounded-xl font-black animate-pulse">
                Chats are loading ...
              </span>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? "bg-amber-950 text-amber-200 relative  self-end font-mono  rounded-2xl p-4"
                  : "border-b-1 border-amber-950 text-amber-950 w-full font-mono p-4"
              }
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                // ✅ user message seedha dikhao
                <ReactMarkdown // ✅ assistant ka markdown render karo
                  components={{
                    code({ inline, className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter style={tomorrow} language={match[1]}>
                          {String(children)}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-800 rounded-3xl text-amber-200 px-1 ">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          ))
        )}
        {assistantloader && (
          <div className="flex text-xs text-amber-950 font-mono font-extrabold gap-2 ">
            <Loader size={20} className="animate-spin text-amber-950" />{" "}
            <p className="opacity-50">blox is thinking</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex h-[15%] self-end items-center justify-center gap-2 px-4 py-3 ">
        <textarea
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendmessage();
            }
          }}
          placeholder="What's on your mind today? Use (Shift + Enter) for new Line"
          className="flex-1 min-h-[44px] max-h-[200px] border bg-amber-200 border-amber-400 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none p-4 text-base placeholder:text-amber-800 font-bold font-mono text-amber-900 leading-relaxed shadow-sm"
          rows={3}
        />
        <button
          onClick={sendmessage}
          disabled={!message.trim()}
          className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-amber-950 hover:bg-amber-900 active:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-full shadow-lg"
        >
          <Send size={24} color="#FDE68A" />
        </button>
      </div>
    </div>
  );
}
