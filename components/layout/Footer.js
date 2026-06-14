"use client";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { X } from "lucide-react";

const SOCIAL_LINKS = [
  { label: "X (Twitter)", symbol: "X", href: "#" },
  { label: "LinkedIn", symbol: "in", href: "#" },
  { label: "GitHub", symbol: "G", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t md:rounded-t-4xl  border-zinc-100 dark:border-zinc-900 mt-20 bg-blue-500 dark:bg-blue-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Clean Layout */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10">
          {/* Brand & Hook */}
          <div className="space-y-3">
            <div className="text-xl flex gap-2 items-center font-black tracking-tight text-white">
              <Bot className="w-6 h-6 text-blue-100" />
              <span>Blox</span>
            </div>
            <p className="text-sm text-zinc-100 dark:text-zinc-100 max-w-[280px] leading-relaxed">
              The AI built for how you actually think. Fast, contextual, and
              free to start.
            </p>
          </div>

          {/* Minimal Newsletter (Kept Creative & Tight) */}
          <div className="w-full max-w-sm space-y-2.5">
            <p className="text-xs font-semibold text-zinc-100 uppercase tracking-widest">
              Stay in the loop
            </p>
            <div className="flex gap-2 p-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full focus-within:border-blue-500 transition-colors duration-200">
              <Input
                placeholder="you@example.com"
                type="email"
                className="rounded-full text-sm h-8 bg-transparent border-0 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <Button
                size="sm"
                className="rounded-full h-8 px-4 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border-0 flex-shrink-0 transition-all"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[1px] w-full bg-zinc-100 " />

        {/* Bottom Metadata & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white order-2 sm:order-1 font-mono">
            © {new Date().getFullYear()} Blox, Inc.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {SOCIAL_LINKS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold no-underline
                  bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800
                  text-zinc-500 dark:text-zinc-400
                  hover:border-zinc-400 dark:hover:border-zinc-600
                  hover:text-zinc-900 dark:hover:text-zinc-100
                  transition-colors duration-150"
              >
                {s.symbol}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
