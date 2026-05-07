"use client";
import { UseAuth } from "@/context/AuthContext";
import axios from "axios";
import { Loader } from "lucide-react";
import { Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NewChat() {
  const [message, setmessage] = useState("");
  const [Messages, setMessages] = useState([]);
  const [mesloader, setmesloader] = useState(false);
  const { user, userloader, reloadData } = UseAuth();
  const router = useRouter();
  async function sendmessage() {
    setmessage("");
    setMessages([...Messages, { role: "user", content: message }]);
    setmesloader(true);
    try {
      const res = await axios.post("/api/Conversation", {
        user_id: user.userId,
        title: message.substring(0, 30),
      });
      reloadData();
      console.log(res.data.conversation._id);
      const res2 = await axios.post("/api/Conversation/messages", {
        conversation_id: res.data.conversation._id,
        role: "user",
        content: message,
      });
      router.push(`/dashboard/Chats/${res.data.conversation._id}`);
    } catch {
      console.log("somthing went wrong");
    } finally {
    }
  }
  return (
    <div className="relative overflow-hidden h-screen w-full py-10">
      {Messages.length === 0 ? (
        <div className="h-[85%] w-full flex flex-col items-center justify-center">
          <div className="relative h-40 w-40  md:h-80 md:w-80">
            <Image
              src="/blox.png"
              alt="blox"
              loading="eager"
              fill={true}
              sizes="full"
              className="flutting h-full w-full"
            />
          </div>
          <div className="text-sm sm:text-2xl md:text-3xl font-mono flex items-center  text-amber-900  drop-shadow-[0_5px_10px_rgba(180,140,0,0.6)] tracking-wider leading-tight">
            <span className="">Hi , </span>
            <span className="bg-amber-950 text-amber-200 p-2 px-4 rounded-full font-black animate-pulse">
              {user.username}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-[85%] w-full overflow-y-auto flex flex-col gap-3 p-4">
          {Messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  msg.role === "user"
                    ? "bg-amber-950 fade-out-element text-amber-200 max-w-full md:max-w-[50%] rounded-2xl p-4"
                    : "border-t-4 border-b-4 border-amber-950 text-amber-950 max-w-[50%] p-4"
                }
              >
                {msg.content}
              </div>
            </div>
          ))}
          {mesloader && (
            <div className="flex text-xs text-amber-950 font-mono font-extrabold gap-2 ">
              <Loader size={20} className="animate-spin text-amber-950" />{" "}
              <p className="opacity-50">blox is thinking</p>
            </div>
          )}
        </div>
      )}

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
          className="flex-1 min-h-[44px] max-h-[200px] border border-amber-400 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none p-4 text-base placeholder:text-amber-800 font-bold font-mono text-amber-900 leading-relaxed shadow-sm"
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
