"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRightCircle, Bot, Send, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AnimatedIcon from "../sparkIcon";

const CHAT_MESSAGES = [
  {
    id: 1,
    role: "user",
    text: "Can you explain quantum entanglement simply?",
    delay: 0,
  },
  {
    id: 2,
    role: "ai",
    text: "Sure — imagine two particles linked together. When you measure one, you instantly know something about the other, even if they’re far apart.",
    delay: 900,
  },
  {
    id: 3,
    role: "user",
    text: "Write me a Python function for that concept.",
    delay: 2000,
  },
  {
    id: 4,
    role: "ai",
    text: "def entangle(q1, q2):\n  q1.hadamard()\n  q2.cnot(q1)\n  return measure(q1, q2)",
    delay: 2900,
    isCode: true,
  },
];

function LiquidGlassCard({
  children,
  className = "",
  draggable = true,
  width,
  height,
  borderRadius = "12px",
  ...props
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      drag={draggable}
      dragElastic={0.08}
      dragMomentum={false}
      className={cn(
        "relative overflow-hidden border border-blue-400/20 bg-transparent backdrop-blur-xl",
        "shadow-[0_16px_50px_rgba(37,99,235,0.10)] dark:shadow-[0_16px_50px_rgba(37,99,235,0.18)]",
        "transition-shadow duration-300",
        className,
      )}
      style={{
        width,
        height,
        borderRadius,
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at var(--x) var(--y), rgba(59,130,246,0.18), transparent 32%), radial-gradient(circle at top left, rgba(96,165,250,0.14), transparent 30%)",
          ["--x"]: `${pointer.x}%`,
          ["--y"]: `${pointer.y}%`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),transparent_40%,transparent_60%,rgba(59,130,246,0.08))]" />
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-blue-400/15",
          isHovering ? "opacity-100" : "opacity-70",
        )}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-blue-400"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ msg, show }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!show) return;
    setTyped("");
    setDone(false);

    if (msg.role === "user" || msg.isCode) {
      setTyped(msg.text);
      setDone(true);
      return;
    }

    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setTyped(msg.text.slice(0, i));
      if (i >= msg.text.length) {
        window.clearInterval(t);
        setDone(true);
      }
    }, 14);

    return () => window.clearInterval(t);
  }, [show, msg]);

  if (!show) return null;

  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-end gap-2", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white shadow-sm",
          isUser ? "bg-blue-700" : "bg-blue-500",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-sm bg-blue-700 text-white"
            : "rounded-bl-sm border border-blue-400/20 bg-blue-50/70 text-blue-950 backdrop-blur dark:bg-blue-950/30 dark:text-blue-50",
        )}
      >
        {msg.isCode ? (
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-blue-600 dark:text-blue-300">
            {typed}
          </pre>
        ) : (
          <>
            {typed}
            {!done && (
              <motion.span
                className="ml-0.5 inline-block h-4 w-0.5 align-middle bg-current"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.55, repeat: Infinity }}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function MockChat() {
  const [visible, setVisible] = useState([]);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const timers = [];

    CHAT_MESSAGES.forEach((m) => {
      if (m.role === "ai") {
        timers.push(
          window.setTimeout(
            () => setShowTyping(true),
            Math.max(0, m.delay - 450),
          ),
        );
        timers.push(
          window.setTimeout(() => {
            setShowTyping(false);
            setVisible((v) => [...v, m.id]);
          }, m.delay),
        );
      } else {
        timers.push(
          window.setTimeout(() => setVisible((v) => [...v, m.id]), m.delay),
        );
      }
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <LiquidGlassCard
      width="100%"
      className="mx-auto max-w-[520px]"
      borderRadius="12px"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-blue-400/15 px-4 py-3">
          <div className="flex h-13 w-13 p-1 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <AnimatedIcon
              animation="draw"
              loop={1}
              color="#ffffff"
              size={40}
              speed={2}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-Gasoek text-sm font-extralight text-blue-950 dark:text-blue-50">
                Blox
              </p>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-300">
                Live
              </span>
            </div>
            <p className="text-xs text-blue-700/70 dark:text-blue-200/70">
              Fast, context-aware responses
            </p>
          </div>

          <motion.div
            className="h-2.5 w-2.5 rounded-full bg-blue-400"
            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </div>

        <div className="flex min-h-[300px] flex-col gap-3 px-4 py-4">
          {CHAT_MESSAGES.map((m) => (
            <ChatMessage key={m.id} msg={m} show={visible.includes(m.id)} />
          ))}

          {showTyping && (
            <div className="flex items-end gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg rounded-bl-sm border border-blue-400/20 bg-blue-50/70 backdrop-blur dark:bg-blue-950/30">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-blue-400/15 px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-blue-400/20 bg-transparent px-3 py-2 backdrop-blur">
            <input
              readOnly
              placeholder="Ask anything..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-blue-700/45 dark:placeholder:text-blue-200/45"
            />
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </LiquidGlassCard>
  );
}

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const pointerStyle = useMemo(
    () => ({
      top: mousePosition.y - 96,
      left: mousePosition.x - 96,
    }),
    [mousePosition],
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent pt-20 text-blue-950 dark:text-blue-50">
      <motion.div
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"
        style={pointerStyle}
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-10 lg:grid-cols-2 lg:px-10 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-blue-400/20 bg-transparent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur dark:text-blue-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Now in open beta
          </motion.div>

          <h1 className="max-w-[11ch] text-5xl font-Gasoek font-extralight text-balance sm:text-6xl lg:text-7xl">
            Meet your next <b className="text-blue-600">brain</b> upgrade.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-blue-900/70 dark:text-blue-100/70 sm:text-lg">
            A clean, fast AI workspace for text, code, and ideas — designed to
            feel calm, focused, and effortless.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15"
            >
              <Link href="/signup">Start thinking smarter</Link>
              <ArrowRightCircle className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-400/20 bg-transparent px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:text-blue-200"
            >
              <Link href="#feature">Explore features</Link>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <MockChat />
        </motion.div>
      </div>
    </section>
  );
}
