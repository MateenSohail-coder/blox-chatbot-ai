"use client";
import { UseAuth } from "@/context/AuthContext";
import axios from "axios";
import { MessageSquareCode } from "lucide-react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function page() {
  const [showDeleteId, setShowDeleteId] = useState(null);
  const { GetConversations, conversation, user, conversationLoader } =
    UseAuth();

  useEffect(() => {
    // Check karein ke user aur userId dono majood hain
    if (user && user.userId) {
      GetConversations(user.userId);
    }
  }, [user?.userId]); // userId aur conversation length dono ko dependency mein rakhein
  async function deleteconversation(id) {
    const res = await axios.delete(`/api/Conversation?conId=${id}`);
    console.log(res?.message);
    GetConversations(user.userId);
  }

  return (
    <div className="h-full mt-10 md:mt-0 w-full px-3 py-10 flex flex-col gap-5 ">
      <h1 className="text-3xl sm:text-4xl px-8 md:text-6xl text-amber-950 font-extrabold font-mono">
        History Of chats
      </h1>
      <div className="overflow-y-auto px-1 flex flex-col gap-1 py-1 rounded-sm">
        {conversationLoader ? (
          <div className="w-full h-100 flex items-center gap-5 justify-center">
            <MessageSquareCode
              size={30}
              className="text-amber-950 animate-pulse "
            />
            <span className="text-xl md:text-3xl font-extrabold font-mono text-amber-950">
              Chats are loading ....
            </span>
          </div>
        ) : (
          conversation.map((item, index) => (
            <div
              key={index}
              className="flex hover:bg-amber-900 fade-out-element  items-center justify-between px-10 border-2 border-amber-950 bg-amber-950 py-4 rounded-sm"
            >
              <Link
                className="title max-w-[50%] min-w-[20%] truncate md:min-w-[70%]  md:max-w-[70%] text-amber-200 font-mono text-xl md:text-2xl"
                href={`/dashboard/Chats/${item._id}`}
              >
                {" "}
                {item.title}...
                <div className="text-sm text-amber-400 font-mono font-bold">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </Link>
              {showDeleteId === item._id ? (
                <div className="flex fade-out-element flex-col sm:flex-row w-full sm:w-[30%] items-center gap-2 p-2  rounded">
                  <span className="text-xs sm:text-sm text-amber-200 font-mono text-center">
                    Are you sure?
                  </span>
                  <div className="flex gap-1 w-full sm:w-auto justify-center">
                    <button
                      onClick={() => setShowDeleteId(null)}
                      className="px-3 py-1 bg-amber-200/80 hover:bg-amber-200 text-xs font-bold text-amber-950 rounded transition-all"
                    >
                      No
                    </button>
                    <button
                      onClick={() => deleteconversation(item._id)}
                      className="px-3 py-1 bg-red-500/80 hover:bg-red-500 text-xs font-bold text-white rounded transition-all"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              ) : (
                <Trash2
                  onClick={() => setShowDeleteId(item._id)}
                  size={25}
                  className="text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
