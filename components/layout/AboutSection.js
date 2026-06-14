"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Zap } from "lucide-react";
import { Focus } from "lucide-react";
import { Paperclip } from "lucide-react";
import { Computer } from "lucide-react";
import { Image } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    accent: "indigo",
    title: "Context-aware memory",
    desc: "NexusAI tracks every thread of your conversation — references, preferences, and code snippets — then connects them as you go. No re-explaining. No losing the thread.",
    detail: "Handles 200K+ token context windows",
    animation: (
      <svg className="w-full h-24 opacity-60" viewBox="0 0 200 80">
        {[
          { cx: 30, cy: 40, r: 8 },
          { cx: 90, cy: 20, r: 6 },
          { cx: 90, cy: 60, r: 6 },
          { cx: 160, cy: 40, r: 8 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="currentColor"
            className="text-indigo-500"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        {[
          [30, 40, 90, 20],
          [30, 40, 90, 60],
          [90, 20, 160, 40],
          [90, 60, 160, 40],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-indigo-400"
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    ),
  },
  {
    icon: Zap,
    accent: "violet",
    title: "Blazing fast responses",
    desc: "Powered by our custom inference engine, NexusAI responds in under 300ms on average. Real-time streaming so your workflow never stalls waiting for tokens.",
    detail: "< 300ms avg. response time",
    animation: (
      <div className="w-full h-24 flex items-center justify-center gap-1.5 opacity-70">
        {[0.3, 0.5, 0.8, 1, 0.9, 0.6, 0.4, 0.7, 1, 0.5, 0.3, 0.8].map(
          (h, i) => (
            <motion.div
              key={i}
              className="w-2 rounded-full bg-violet-500"
              animate={{ scaleY: [h, h * 1.5 > 1 ? 1 : h * 1.5, h] }}
              style={{ height: `${h * 60}px`, transformOrigin: "center" }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.07,
                ease: "easeInOut",
              }}
            />
          ),
        )}
      </div>
    ),
  },
  {
    icon: Focus,
    accent: "emerald",
    title: "Truly multimodal",
    desc: "Paste a screenshot, upload a PDF, drop in code — NexusAI sees and understands it all. Switch between text, image, and code fluidly within one conversation.",
    detail: "Text · Code · Images · PDFs",
    animation: (
      <div className="w-full h-24 flex items-center justify-center gap-4 opacity-80">
        {[
          { icon: Paperclip, label: "Text", delay: 0 },
          { icon: Computer, label: "Code", delay: 0.2 },
          { icon: Image, label: "Images", delay: 0.4 },
        ].map((item) => (
          <motion.div
            key={item.label}
            className="flex flex-col items-center gap-1"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <span className="text-2xl">
              <item.icon className="h-7 w-7" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    ),
  },
];

const ACCENT_CLASSES = {
  indigo: {
    icon: "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20",
    badge:
      "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10",
    glow: "dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]",
  },
  violet: {
    icon: "bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20",
    badge:
      "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10",
    glow: "dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]",
  },
  emerald: {
    icon: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20",
    badge:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
    glow: "dark:hover:shadow-[0_0_30px_rgba(52,211,153,0.12)]",
  },
};

function FeatureCard({ f, index }) {
  const ac = ACCENT_CLASSES[f.accent];
  const Icon = f.icon;
  return (
    <motion.div
      id="feature"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card
        className={`h-full border rounded-lg overflow-hidden cursor-default transition-shadow duration-300
          bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800
          shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.6)]
          ${ac.glow}`}
      >
        <CardContent className="p-6 flex flex-col gap-4">
          {/* Animation area */}
          <div className="rounded-xl overflow-hidden bg-white dark:bg-black border border-zinc-100 dark:border-zinc-900">
            {f.animation}
          </div>

          {/* Icon + title */}
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${ac.icon}`}
            >
              <Icon className="dark:text-blue-100 text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50 mb-0.5">
                {f.title}
              </h3>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${ac.badge}`}
              >
                {f.detail}
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {f.desc}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <p className="text-xs font-bold tracking-[0.12em] uppercase text-indigo-500 dark:text-indigo-400 mb-3">
          Capabilities
        </p>
        <h2 className="text-4xl font-Gasoek lg:text-5xl font-extralight leading-tight mb-4 text-zinc-900 dark:text-zinc-50">
          Everything you need.
          <br />
          Nothing you don't.
        </h2>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
          Three core superpowers that make NexusAI fundamentally different from
          anything you've used before.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} f={f} index={i} />
        ))}
      </div>
    </section>
  );
}
