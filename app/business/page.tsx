"use client";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Ring } from "@/components/ui/Ring";
import { useStore, Lead } from "@/lib/store";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, Phone, Plus, Send, Target, UserPlus } from "lucide-react";
import clsx from "clsx";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";

const goals = [
  { label: "Research 10 potential clients", target: 10, current: 7 },
  { label: "Reach out to 5 businesses", target: 5, current: 4 },
  { label: "Build / improve 1 portfolio project", target: 1, current: 0.6 },
  { label: "Business hours > distraction", target: 100, current: 72 },
];

const revTrend = [
  { d: "W1", r: 1200 },
  { d: "W2", r: 1800 },
  { d: "W3", r: 2200 },
  { d: "W4", r: 3100 },
  { d: "W5", r: 4820 },
];

const statuses: Lead["status"][] = ["new", "contacted", "replied", "closed"];

export default function BusinessPage() {
  const leads = useStore((s) => s.leads);
  const addLead = useStore((s) => s.addLead);
  const setLeadStatus = useStore((s) => s.setLeadStatus);

  const [name, setName] = useState("");
  const [value, setValue] = useState<number | "">("");

  const pipeline = leads.reduce((a, l) => a + (l.value ?? 0), 0);
  const closed = leads.filter((l) => l.status === "closed").reduce((a, l) => a + (l.value ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="label">Operations · Sector 03</div>
          <h1 className="text-3xl font-semibold tracking-tight holo-text">Business Engine</h1>
        </div>
        <div className="chip"><Briefcase className="h-3 w-3 text-nx-accent" /> {leads.length} leads tracked</div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Pipeline" tone="cyan" value={`$${pipeline.toLocaleString()}`} delta="+22%" hint="all leads" icon={<DollarSign className="h-4 w-4" />} />
        <Stat label="Closed MTD" tone="green" value={`$${closed.toLocaleString()}`} delta="+18%" hint="this month" icon={<Target className="h-4 w-4" />} />
        <Stat label="Outreach" tone="violet" value="14" delta="+5" hint="this week" icon={<Send className="h-4 w-4" />} />
        <Stat label="Reply Rate" tone="amber" value="36%" delta="+6%" hint="trailing 30d" icon={<Phone className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Weekly Goals" subtitle="Momentum tracker" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const pct = Math.min(100, (g.current / g.target) * 100);
              return (
                <div key={g.label} className="glass p-4 flex items-center gap-4">
                  <Ring value={pct} size={84} stroke={8} label="GOAL" />
                  <div className="flex-1">
                    <div className="text-sm text-white/90">{g.label}</div>
                    <div className="text-[11px] text-nx-dim mt-0.5 font-mono">
                      {typeof g.current === "number" ? g.current.toFixed(1) : g.current} / {g.target}
                    </div>
                    <div className="mt-2 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-nx-accent to-nx-violet shadow-glow"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Revenue Trend" subtitle="5-week ascent" className="col-span-12 lg:col-span-4">
          <div className="text-2xl font-semibold">${revTrend[revTrend.length-1].r.toLocaleString()}</div>
          <div className="text-xs text-nx-green">+55% vs W1</div>
          <div className="h-44 mt-2">
            <ResponsiveContainer>
              <AreaChart data={revTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="r" stroke="#34d399" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Lead CRM"
        subtitle="Outreach pipeline"
        right={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              addLead({ name, channel: "Email", status: "new", value: typeof value === "number" ? value : undefined });
              setName(""); setValue("");
            }}
            className="flex items-center gap-2"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New lead name…"
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none text-white/90 w-40"
            />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value ? Number(e.target.value) : "")}
              placeholder="$"
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none text-white/90 w-20"
            />
            <button className="btn"><Plus className="h-3 w-3" /> Add</button>
          </form>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {statuses.map((st) => (
            <div key={st} className="glass p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="label">{st.toUpperCase()}</span>
                <span className="text-[10px] text-nx-dim font-mono">{leads.filter(l=>l.status===st).length}</span>
              </div>
              <div className="space-y-2">
                {leads.filter((l) => l.status === st).map((l) => (
                  <motion.div
                    key={l.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/90">{l.name}</div>
                      {l.value && <span className="text-[11px] text-nx-green font-mono">${l.value}</span>}
                    </div>
                    <div className="text-[11px] text-nx-dim mt-0.5">{l.channel}</div>
                    <div className="mt-2 flex gap-1">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => setLeadStatus(l.id, s)}
                          className={clsx(
                            "h-1.5 flex-1 rounded-full transition",
                            l.status === s ? "bg-nx-accent shadow-glow" : "bg-white/10 hover:bg-white/20"
                          )}
                          title={s}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
                {leads.filter(l=>l.status===st).length === 0 && (
                  <div className="text-[11px] text-nx-dim/70 italic px-1 py-2">Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
