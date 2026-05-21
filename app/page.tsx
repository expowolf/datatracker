"use client";
import { Panel } from "@/components/ui/Panel";
import { Ring } from "@/components/ui/Ring";
import { Stat } from "@/components/ui/Stat";
import { Sparkline } from "@/components/ui/Sparkline";
import { Heatmap } from "@/components/ui/Heatmap";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Brain, Briefcase, CheckCircle2, Circle, Coins, Flame, Play, Pause, Target, Timer, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const sparkA = Array.from({ length: 24 }, (_, i) => ({ x: i, y: 40 + Math.sin(i / 2) * 18 + Math.random() * 8 }));
const sparkB = Array.from({ length: 24 }, (_, i) => ({ x: i, y: 30 + Math.cos(i / 3) * 14 + Math.random() * 10 }));

export default function CommandCenter() {
  const tasks = useStore((s) => s.tasks);
  const habits = useStore((s) => s.habits);
  const weekly = useStore((s) => s.weeklyHours);
  const heatmap = useStore((s) => s.heatmap);
  const focus = useStore((s) => s.focus);
  const setFocus = useStore((s) => s.setFocus);
  const toggleTask = useStore((s) => s.toggleTask);
  const score = useStore((s) => s.dailyScore());
  const momentum = useStore((s) => s.weeklyMomentum());
  const holdings = useStore((s) => s.holdings);
  const books = useStore((s) => s.books);

  const portValue = holdings.reduce((a, h) => a + h.price * h.shares, 0);
  const portCost = holdings.reduce((a, h) => a + h.cost * h.shares, 0);
  const pl = portValue - portCost;
  const plPct = (pl / Math.max(1, portCost)) * 100;

  const totalRead = books.reduce((a, b) => a + b.read, 0);
  const totalPages = books.reduce((a, b) => a + b.pages, 0);
  const readPct = (totalRead / Math.max(1, totalPages)) * 100;

  const completedTasks = tasks.filter((t) => t.done).length;

  // Focus timer
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed = focus.active && focus.startedAt ? Math.floor((now - focus.startedAt) / 1000) : 0;
  const total = focus.durationMin * 60;
  const remain = Math.max(0, total - elapsed);
  const mm = String(Math.floor(remain / 60)).padStart(2, "0");
  const ss = String(remain % 60).padStart(2, "0");
  const focusPct = (1 - remain / total) * 100;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
      >
        <div>
          <div className="label">Command Center · Sector 01</div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="holo-text">Good evening, Operator.</span>
          </h1>
          <p className="text-sm text-nx-dim mt-1">
            Momentum {momentum}% · {completedTasks}/{tasks.length} objectives complete · {habits.find((h) => h.id === "h3")?.streak ?? 0}-day reading streak.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="chip"><Brain className="h-3 w-3 text-nx-violet" /> AI INSIGHTS</div>
          <div className="chip"><Flame className="h-3 w-3 text-nx-amber" /> STREAK · {habits[0]?.streak ?? 0}d</div>
        </div>
      </motion.div>

      {/* TOP GRID */}
      <div className="grid grid-cols-12 gap-4">
        {/* Daily score ring */}
        <Panel title="Daily Productivity" subtitle="Composite score" className="col-span-12 md:col-span-4" glow delay={0.05}>
          <div className="flex items-center justify-between gap-4">
            <Ring value={score} size={150} label="DAY SCORE" sub="vs 7d avg" />
            <div className="flex-1 space-y-2.5">
              <MetricBar label="Focus" val={momentum} color="bg-nx-accent" />
              <MetricBar label="Tasks" val={Math.round((completedTasks / Math.max(1, tasks.length)) * 100)} color="bg-nx-violet" />
              <MetricBar label="Habits" val={Math.round((habits.reduce((a, h) => a + h.days.filter(Boolean).length, 0) / (habits.length * 7)) * 100)} color="bg-nx-green" />
              <MetricBar label="Reading" val={Math.round(readPct)} color="bg-nx-amber" />
            </div>
          </div>
        </Panel>

        {/* Focus timer */}
        <Panel title="Focus Engine" subtitle={focus.active ? "Session in progress" : "Idle"} className="col-span-12 md:col-span-4" delay={0.1}>
          <div className="relative flex flex-col items-center">
            <Ring value={focus.active ? focusPct : 0} size={150} color="#a78bfa" label={focus.active ? "ACTIVE" : "READY"} sub={`${focus.durationMin}m block`} />
            <div className="mt-2 font-mono text-2xl tracking-widest text-white">
              {focus.active ? `${mm}:${ss}` : "—:—"}
            </div>
            <div className="mt-3 flex gap-2">
              {[15, 25, 50].map((m) => (
                <button
                  key={m}
                  onClick={() => setFocus({ durationMin: m })}
                  className={clsx("btn", focus.durationMin === m && "ring-1 ring-nx-accent/40 text-white")}
                >{m}m</button>
              ))}
              <button
                onClick={() =>
                  focus.active
                    ? setFocus({ active: false, startedAt: null })
                    : setFocus({ active: true, startedAt: Date.now() })
                }
                className="btn ring-1 ring-nx-accent/30 text-white"
              >
                {focus.active ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Start</>}
              </button>
            </div>
          </div>
        </Panel>

        {/* Quick stats stack */}
        <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
          <Stat
            label="Portfolio"
            tone="green"
            value={`$${portValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            delta={`${pl >= 0 ? "+" : ""}${plPct.toFixed(2)}%`}
            hint="all assets"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <Stat
            label="Revenue MTD"
            tone="amber"
            value={`$4,820`}
            delta="+18.2%"
            hint="vs last month"
            icon={<Coins className="h-4 w-4" />}
          />
          <Stat
            label="Deep Work"
            tone="cyan"
            value={`${weekly.reduce((a, b) => a + b.deep, 0).toFixed(1)}h`}
            delta="+12%"
            hint="this week"
            icon={<Brain className="h-4 w-4" />}
          />
          <Stat
            label="Outreach"
            tone="violet"
            value="14"
            delta="+5"
            hint="contacts week"
            icon={<Briefcase className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* MID GRID */}
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Deep Work vs Distraction" subtitle="Weekly · hours" className="col-span-12 lg:col-span-8" delay={0.05}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} barGap={4}>
                <defs>
                  <linearGradient id="bDeep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="bDist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#7c8aa8" }} />
                <Bar dataKey="deep" name="Deep work" fill="url(#bDeep)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="distract" name="Distraction" fill="url(#bDist)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Consistency Map" subtitle="Last 49 days" className="col-span-12 lg:col-span-4" delay={0.1}>
          <Heatmap data={heatmap} cols={7} />
          <div className="mt-4 flex items-center gap-2 text-[10px] text-nx-dim">
            <span>LESS</span>
            {[0,1,2,3,4].map(v=>(
              <span key={v} className={clsx("h-3 w-3 rounded-sm border border-white/5",
                v===0?"bg-white/[0.04]":v===1?"bg-nx-accent/20":v===2?"bg-nx-accent/40":v===3?"bg-nx-accent/65":"bg-nx-accent/90")} />
            ))}
            <span>MORE</span>
          </div>
        </Panel>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-12 gap-4">
        {/* Tasks */}
        <Panel
          title="Objectives"
          subtitle="Today"
          className="col-span-12 lg:col-span-5"
          right={<div className="chip"><Target className="h-3 w-3 text-nx-accent" /> {completedTasks}/{tasks.length}</div>}
          delay={0.05}
        >
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {tasks.slice(0, 6).map((t) => (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.05] transition"
                >
                  <button onClick={() => toggleTask(t.id)} className="text-nx-accent">
                    {t.done ? <CheckCircle2 className="h-4 w-4 text-nx-green" /> : <Circle className="h-4 w-4 text-nx-dim" />}
                  </button>
                  <span className={clsx("flex-1 text-sm", t.done ? "line-through text-nx-dim" : "text-white/90")}>{t.title}</span>
                  {t.tag && <span className="chip">{t.tag}</span>}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Panel>

        {/* Habits */}
        <Panel title="Habits Matrix" subtitle="Weekly streaks" className="col-span-12 lg:col-span-4" delay={0.1}>
          <div className="space-y-3">
            {habits.map((h) => (
              <div key={h.id} className="flex items-center gap-3">
                <div className="w-24 text-xs text-white/80">{h.name}</div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {h.days.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={clsx(
                        "h-5 rounded-md border border-white/5",
                        d ? "bg-nx-accent/70 shadow-glow" : "bg-white/[0.04]"
                      )}
                    />
                  ))}
                </div>
                <div className="chip">
                  <Flame className="h-3 w-3 text-nx-amber" /> {h.streak}d
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Portfolio + reading mini */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Panel title="Portfolio Pulse" subtitle="24h trail" delay={0.15}>
            <div className="text-2xl font-semibold tracking-tight">
              ${portValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className={clsx("text-xs flex items-center gap-1 mt-0.5", pl >= 0 ? "text-nx-green" : "text-nx-rose")}>
              <ArrowUpRight className="h-3 w-3" />
              {pl >= 0 ? "+" : ""}${pl.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {plPct.toFixed(2)}%
            </div>
            <div className="mt-2">
              <Sparkline data={sparkA} />
            </div>
          </Panel>
          <Panel title="Reading" subtitle="Progress" delay={0.2}>
            <Ring value={readPct} size={110} color="#fbbf24" label="LIBRARY" sub={`${totalRead}/${totalPages} pages`} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, val, color }: { label: string; val: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-nx-dim">
        <span>{label}</span>
        <span className="text-white/80 font-mono">{val}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${val}%` }}
          transition={{ duration: 1, ease: [0.22, 0.9, 0.3, 1] }}
          className={clsx("h-full rounded-full shadow-glow", color)}
        />
      </div>
    </div>
  );
}
