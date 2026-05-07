"use client";
import React from "react";
import { UseAuth } from "@/context/AuthContext";
import { LogOut, UserCog, Mail } from "lucide-react";
import Link from "next/link";

export default function Settings() {
  const { user, logout } = UseAuth();

  return (
    <div className="flex flex-col h-full w-full items-center gap-8 py-10 px-10 bg-amber-200  transition-colors duration-300">
      {/* Logo */}
      <div className="logo h-40 w-40 rounded-full bg-amber-950 text-amber-200 text-7xl flex items-center justify-center font-extrabold font-mono shadow-lg">
        {user?.username?.slice(0, 1)?.toUpperCase() || "?"}
      </div>

      {/* User Info */}
      <div className="info flex flex-col gap-5 w-full max-w-md">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-amber-950  bg-transparent">
          <UserCog size={22} className="text-amber-950" />
          <span className="text-amber-950  font-mono text-xl">
            {user?.username || "Guest"}
          </span>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-amber-950  bg-transparent">
          <Mail size={22} className="text-amber-950" />
          <span className="text-amber-950  font-mono text-xl">
            {user?.userEmail || "No email"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 w-full max-w-md mt-8">
        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-5 py-3  cursor-pointer rounded-xl bg-red-700 text-amber-50 font-bold font-mono hover:bg-red-800 transition"
        >
          <LogOut size={22} /> Logout
        </button>

        {/* Future Features */}
        <Link
          href="/dashboard/history"
          className="flex items-center justify-center gap-2 px-5 py-3  text-amber-950 font-bold font-mono  "
        >
          Manage History
        </Link>
      </div>
    </div>
  );
}
