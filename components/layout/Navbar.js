"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Bot } from "lucide-react";
import Link from "next/link";
import AnimatedIcon from "../sparkIcon";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 h-16 
          backdrop-blur-md border-b transition-all duration-300
          bg-white/80 dark:bg-black/80 border-zinc-200 dark:border-zinc-900
          ${scrolled ? "shadow-sm dark:shadow-[0_1px_40px_rgba(0,0,0,0.6)]" : ""}`}
      >
        {/* Logo */}
        <div className="text-xl flex items-center gap-3 font-black tracking-tight  text-blue-500  select-none">
          <AnimatedIcon
            animation="flow"
            loop="infinite"
            color="#378ADD"
            size={40}
            speed={6}
          />
          <p className="hidden md:block">Blox</p>
        </div>

        {/* Right actions — desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="rounded-sm font-Maria border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-sm font-Maria bg-gradient-to-r from-blue-500 to-blue-800 hover:opacity-90 text-white border-0"
            >
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-900 p-4 flex flex-col gap-2 shadow-xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 mt-1 flex flex-col gap-2">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-sm"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full rounded-sm bg-gradient-to-r from-blue-500 to-blue-800 text-white border-0"
                >
                  Get started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
