"use client";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { useStore } from "@/lib/store";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowDownRight, ArrowUpRight, Coins, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import clsx from "clsx";

const growth = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  v: 18000 + i * 220 + Math.sin(i / 2) * 600 + Math.random() * 400,
}));

const palette = ["#7dd3fc", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"];

export default function FinancePage() {
  const holdings = useStore((s) => s.holdings);
  const total = holdings.reduce((a, h) => a + h.price * h.shares, 0);
  const cost = holdings.reduce((a, h) => a + h.cost * h.shares, 0);
  const pl = total - cost;
  const plPct = (pl / Math.max(1, cost)) * 100;

  const alloc = holdings.map((h) => ({ name: h.symbol, value: h.price * h.shares }));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="label">Finance · Sector 04</div>
          <h1 className="text-3xl font-semibold tracking-tight holo-text">Capital Flow</h1>
        </div>
        <div className="chip"><TrendingUp className="h-3 w-3 text-nx-green" /> Live snapshot</div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Net Worth" tone="cyan" value={`$${(total + 12400).toLocaleString(undefined,{maximumFractionDigits:0})}`} delta="+4.2%" hint="30d" icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Portfolio" tone="violet" value={`$${total.toLocaleString(undefined,{maximumFractionDigits:0})}`} delta={`${pl>=0?"+":""}${plPct.toFixed(2)}%`} hint="all assets" icon={<TrendingUp className="h-4 w-4" />} />
        <Stat label="Savings" tone="green" value="$12,400" delta="+$840" hint="this month" icon={<PiggyBank className="h-4 w-4" />} />
        <Stat label="Spending" tone="rose" value="$2,180" delta="-8%" hint="vs avg" icon={<Coins className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Portfolio Growth" subtitle="30 day trail" className="col-span-12 lg:col-span-8">
          <div className="flex items-baseline gap-4">
            <div className="text-3xl font-semibold">${total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
            <div className={clsx("text-sm font-mono", pl>=0?"text-nx-green":"text-nx-rose")}>
              {pl>=0 ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
              {pl>=0?"+":""}${pl.toLocaleString(undefined,{maximumFractionDigits:0})} ({plPct.toFixed(2)}%)
            </div>
          </div>
          <div className="h-72 mt-2">
            <ResponsiveContainer>
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7c8aa8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#7dd3fc" strokeWidth={2} fill="url(#fg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Asset Allocation" className="col-span-12 lg:col-span-4">
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={alloc} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke="rgba(0,0,0,0)">
                  {alloc.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(10,15,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {alloc.map((a, i) => (
              <div key={a.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: palette[i % palette.length] }} />
                <span className="text-white/80 flex-1">{a.name}</span>
                <span className="text-nx-dim font-mono">${a.value.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Holdings" subtitle="Live positions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.18em] text-nx-dim">
                <th className="text-left py-2">Symbol</th>
                <th className="text-right">Shares</th>
                <th className="text-right">Cost</th>
                <th className="text-right">Price</th>
                <th className="text-right">Value</th>
                <th className="text-right">P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {holdings.map((h) => {
                const val = h.shares * h.price;
                const c = h.shares * h.cost;
                const p = val - c;
                const pp = (p / c) * 100;
                return (
                  <tr key={h.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 text-white font-medium">{h.symbol}</td>
                    <td className="text-right text-white/80 font-mono">{h.shares}</td>
                    <td className="text-right text-nx-dim font-mono">${h.cost.toLocaleString()}</td>
                    <td className="text-right text-white/80 font-mono">${h.price.toLocaleString()}</td>
                    <td className="text-right text-white font-mono">${val.toLocaleString(undefined,{maximumFractionDigits:0})}</td>
                    <td className={clsx("text-right font-mono", p>=0?"text-nx-green":"text-nx-rose")}>
                      {p>=0?"+":""}${p.toLocaleString(undefined,{maximumFractionDigits:0})} ({pp.toFixed(1)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
