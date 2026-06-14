"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    role: "Product Lead @ Figma",
    initials: "PM",
    color: "#6366f1",
    stars: 5,
    text: "NexusAI has completely changed how I draft PRDs. It understands context like a co-founder, not just a tool. The memory across conversations is genuinely magical.",
  },
  {
    name: "James Okafor",
    role: "CTO @ Bloom",
    initials: "JO",
    color: "#8b5cf6",
    stars: 5,
    text: "The multimodal capabilities are next-level. I send it screenshots of bugs and it diagnoses them instantly — with the exact line of code to fix. Incredible.",
  },
  {
    name: "Selin Arslan",
    role: "Researcher @ MIT",
    initials: "SA",
    color: "#10b981",
    stars: 5,
    text: "I use NexusAI daily for literature reviews. The context window and source reasoning are genuinely impressive. It's become indispensable in my workflow.",
  },
  {
    name: "Tom Kraft",
    role: "Indie Hacker",
    initials: "TK",
    color: "#f59e0b",
    stars: 5,
    text: "Built an entire SaaS MVP in a weekend using NexusAI as my co-pilot. The code quality is exceptional, and it catches edge cases I would've missed entirely.",
  },
  {
    name: "Diana Chen",
    role: "Designer @ Stripe",
    initials: "DC",
    color: "#ec4899",
    stars: 5,
    text: "It writes better UX copy than most humans I've worked with. And it iterates instantly on feedback without losing the original voice. Genuinely impressive.",
  },
  {
    name: "Arjun Shah",
    role: "CEO @ Syntax",
    initials: "AS",
    color: "#14b8a6",
    stars: 5,
    text: "Our customer support resolution time dropped 60% after integrating NexusAI into our stack. The ROI was visible within the first week. Absolutely recommend.",
  },
];

function TestimonialCard({ t }) {
  return (
    <div
      className="flex-shrink-0 w-[300px] p-5 rounded-lg transition-all duration-200
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        shadow-sm dark:shadow-[0_0_0_1px_rgba(0,0,0,0.4)]
        hover:border-indigo-200 dark:hover:border-zinc-600
        dark:hover:shadow-[0_0_24px_rgba(99,102,241,0.08)]
        group cursor-default"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarFallback
            className="text-xs font-bold text-white"
            style={{ background: t.color }}
          >
            {t.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
            {t.name}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-tight">
            {t.role}
          </p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-2.5">
        {Array.from({ length: t.stars }).map((_, i) => (
          <span key={i} className="text-amber-400 text-sm">
            ★
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        "{t.text}"
      </p>
    </div>
  );
}

export default function Testimonials() {
  const [paused, setPaused] = useState(false);
  // Duplicate for seamless loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-24 overflow-hidden">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-6"
      >
        <p className="text-xs font-bold tracking-[0.12em] uppercase text-indigo-500 dark:text-indigo-400 mb-3">
          Testimonials
        </p>
        <h2 className="text-4xl font-Gasoek lg:text-5xl font-extralight leading-tight text-zinc-900 dark:text-zinc-50">
          Loved by thinkers,
          <br />
          builders, and teams
        </h2>
      </motion.div>

      {/* Marquee wrapper with fade edges */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none
          bg-gradient-to-r from-white dark:from-black to-transparent"
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none
          bg-gradient-to-l from-white dark:from-black to-transparent"
        />

        {/* Scrolling track */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="flex gap-4 py-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                duration: 32,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {doubled.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
