import { MessageSquareCode } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="h-screen w-full overflow-hidden bg-amber-200 gap-3 flex  flex-col items-center justify-center">
      <div className="text-2xl flex items-center gap-2 sm:text-3xl md:text-6xl font-extrabold text-amber-950 font-mono">
        <MessageSquareCode
          size={50}
          color="#451a03"
          className="inline-block mb-2"
        />
        Chats With Blox
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <Link href="/login">
          <button className="fade-out-element card p-6 text-2xl sm:text-3xl md:text-8xl text-amber-950 font-extrabold border-8 hover:bg-amber-950 hover:text-amber-200 active:bg-amber-950 active:text-amber-200 transition-all active:scale-[0.96] hover:transform-3d hover:translate-y-1 cursor-pointer border-amber-950 font-mono rounded-2xl">
            Login ↘
          </button>
        </Link>
        <Link href="/signup">
          <button className="fade-out-element card p-6 text-2xl sm:text-3xl md:text-8xl text-amber-200 bg-amber-950 font-extrabold border-8 hover:bg-amber-200 active:bg-amber-200 hover:text-amber-950 active:text-amber-950 transition-all active:scale-[0.96] hover:transform-3d hover:translate-y-1 cursor-pointer border-amber-950 font-mono rounded-2xl">
            SignUp ↗
          </button>
        </Link>
      </div>
    </div>
  );
}
