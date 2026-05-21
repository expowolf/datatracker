"use client";
import { motion } from "framer-motion";
import { Bell, Command, Search, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export function Topbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const focusActive = useStore((s) => s.focus.active);
  const score = useStore((s) => s.dailyScore());

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      setDate(d.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-black/20 backdrop-blur-xl px-4 md:px-8 py-3">
      <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] text-nx-dim">
        <span className="h-1.5 w-1.5 rounded-full bg-nx-green shadow-glow animate-pulse" />
        ONLINE
      </div>

      <div className="hidden md:flex items-center gap-2 ml-4 font-mono text-xs">
        <span className="text-white/90">{time}</span>
        <span className="text-nx-dim">·</span>
        <span className="text-nx-dim">{date}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-nx-dim w-72">
          <Search className="h-3.5 w-3.5" />
          <input
            placeholder="Search command, tasks, ideas…"
            className="bg-transparent outline-none flex-1 placeholder:text-nx-dim/70 text-white/80"
          />
          <kbd className="flex items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-nx-dim">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        <motion.div
          className="chip"
          animate={{ opacity: focusActive ? [0.6, 1, 0.6] : 1 }}
          transition={{ duration: 1.6, repeat: focusActive ? Infinity : 0 }}
        >
          <Zap className="h-3 w-3 text-nx-amber" />
          {focusActive ? "FOCUS ACTIVE" : "STANDBY"}
        </motion.div>

        <div className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-nx-accent shadow-glow" />
          DAY SCORE · {score}
        </div>

        <button className="btn">
          <Bell className="h-3.5 w-3.5" /> 3
        </button>
      </div>
    </header>
  );
}
