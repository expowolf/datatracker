"use client";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Ring } from "@/components/ui/Ring";
import { Heatmap } from "@/components/ui/Heatmap";
import { useStore } from "@/lib/store";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Clock, Flame, Smartphone, Zap } from "lucide-react";

export default function ProductivityPage() {
  const weekly = useStore((s) => s.weeklyHours);
  const heatmap = useStore((s) => s.heatmap);
  const habits = useStore((s) => s.habits);
  const score = useStore((s) => s.dailyScore());
  const momentum = useStore((s) => s.weeklyMomentum());

  const deep = weekly.reduce((a, b) => a + b.deep, 0);
  const dist = weekly.reduce((a, b) => a + b.distract, 0);

  const focusTrend = weekly.map((w) => ({ day: w.day, score: Math.round((w.deep / Math.max(0.1, w.deep + w.distract)) * 100) }));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="label">Productivity · Sector 02</div>
          <h1 className="text-3xl font-semibold tracking-tight holo-text">Performance Lab</h1>
        </div>
        <div className="chip"><Zap className="h-3 w-3 text-nx-amber" /> Momentum {momentum}%</div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Deep Work" value={`${deep.toFixed(1)}h`} delta="+9%" hint="this week" tone="cyan" icon={<Clock className="h-4 w-4" />} />
        <Stat label="Distracted" value={`${dist.toFixed(1)}h`} delta="-12%" hint="this week" tone="rose" icon={<Smartphone className="h-4 w-4" />} />
        <Stat label="Focus Score" value={`${score}`} delta="+4" hint="today" tone="violet" icon={<Activity className="h-4 w-4" />} />
        <Stat label="Best Streak" value={`${Math.max(...habits.map(h=>h.streak))}d`} delta="+1d" hint="reading" tone="amber" icon={<Flame className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Focus Score Trend" subtitle="Last 7 days" className="col-span-12 lg:col-span-8">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusTrend}>
                <defs>
                  <linearGradient id="ftA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={2} fill="url(#ftA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Today's Composite" className="col-span-12 lg:col-span-4">
          <div className="flex flex-col items-center">
            <Ring value={score} size={170} label="DAY SCORE" sub="Focus + Tasks + Habits" />
            <div className="mt-4 grid grid-cols-3 gap-3 w-full">
              <Mini label="Deep" v={`${weekly[weekly.length-1]?.deep.toFixed(1)}h`} />
              <Mini label="Dist" v={`${weekly[weekly.length-1]?.distract.toFixed(1)}h`} />
              <Mini label="Ratio" v={`${Math.round((weekly[weekly.length-1]?.deep / Math.max(0.1,(weekly[weekly.length-1]?.deep+weekly[weekly.length-1]?.distract))) * 100)}%`} />
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Consistency Heatmap" subtitle="49 day grid" className="col-span-12 lg:col-span-6">
          <Heatmap data={heatmap} cols={7} />
        </Panel>
        <Panel title="Monthly Comparison" subtitle="Deep work hours" className="col-span-12 lg:col-span-6">
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={[
                { m: "Jan", a: 92, b: 70 },
                { m: "Feb", a: 110, b: 92 },
                { m: "Mar", a: 124, b: 110 },
                { m: "Apr", a: 138, b: 124 },
                { m: "May", a: 152, b: 138 },
              ]}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="m" stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="a" stroke="#7dd3fc" strokeWidth={2} dot={{ r: 3, fill: "#7dd3fc" }} />
                <Line type="monotone" dataKey="b" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3, fill: "#a78bfa" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Mini({ label, v }: { label: string; v: string }) {
  return (
    <div className="glass p-2.5 text-center">
      <div className="label">{label}</div>
      <div className="text-sm text-white mt-1 font-mono">{v}</div>
    </div>
  );
}
