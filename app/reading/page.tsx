"use client";
import { Panel } from "@/components/ui/Panel";
import { Ring } from "@/components/ui/Ring";
import { Stat } from "@/components/ui/Stat";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { BookOpen, Flame, Plus, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const monthly = [
  { m: "Jan", pages: 320 },
  { m: "Feb", pages: 410 },
  { m: "Mar", pages: 380 },
  { m: "Apr", pages: 520 },
  { m: "May", pages: 612 },
];

export default function ReadingPage() {
  const books = useStore((s) => s.books);
  const addPages = useStore((s) => s.addBookPages);
  const habits = useStore((s) => s.habits);
  const streak = habits.find((h) => h.id === "h3")?.streak ?? 0;

  const totalRead = books.reduce((a, b) => a + b.read, 0);
  const totalPages = books.reduce((a, b) => a + b.pages, 0);
  const finished = books.filter((b) => b.read >= b.pages).length;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="label">Knowledge · Sector 05</div>
          <h1 className="text-3xl font-semibold tracking-tight holo-text">Library Core</h1>
        </div>
        <div className="chip"><Flame className="h-3 w-3 text-nx-amber" /> {streak}-day streak</div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active Books" tone="cyan" value={books.length} hint="in library" icon={<BookOpen className="h-4 w-4" />} />
        <Stat label="Pages Read" tone="violet" value={totalRead} delta="+28" hint="today" />
        <Stat label="Finished" tone="green" value={finished} hint="completed" />
        <Stat label="Knowledge Gain" tone="amber" value={`${Math.round((totalRead/Math.max(1,totalPages))*100)}%`} delta="+4%" hint="library mastery" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Monthly Pages" subtitle="Trend" className="col-span-12 lg:col-span-8">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <defs>
                  <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="m" stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pages" fill="url(#bp)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Library Progress" className="col-span-12 lg:col-span-4">
          <div className="flex flex-col items-center">
            <Ring value={(totalRead/Math.max(1,totalPages))*100} size={160} color="#fbbf24" label="MASTERY" sub={`${totalRead}/${totalPages} pages`} />
          </div>
        </Panel>
      </div>

      <Panel title="Bookshelf" subtitle="Tap +30 to log pages">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((b, i) => {
            const pct = (b.read / b.pages) * 100;
            const done = b.read >= b.pages;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass p-4 group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl"
                  style={{ background: done ? "rgba(52,211,153,0.18)" : "rgba(125,211,252,0.15)" }} />
                <div className="relative">
                  <div className="aspect-[3/4] rounded-lg mb-3 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${["#1e293b","#312e81","#0f766e","#7c2d12"][i%4]}, #0b1220)`,
                    }}>
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <div className="text-[10px] tracking-[0.2em] text-white/60">VOL · 0{i+1}</div>
                      <div>
                        <div className="text-sm font-semibold text-white leading-tight">{b.title}</div>
                        <div className="text-[11px] text-white/60 mt-0.5">{b.author}</div>
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/20" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-nx-dim font-mono">{b.read}/{b.pages}p</span>
                    <span className={done ? "text-nx-green" : "text-nx-accent"}>{Math.round(pct)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full shadow-glow ${done ? "bg-nx-green" : "bg-gradient-to-r from-nx-accent to-nx-violet"}`}
                    />
                  </div>
                  <button
                    onClick={() => addPages(b.id, 30)}
                    className="btn w-full mt-3 justify-center"
                    disabled={done}
                  >
                    <Plus className="h-3 w-3" /> Log 30 pages
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
