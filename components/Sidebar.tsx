"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  Briefcase,
  LineChart,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/", label: "Command", icon: LayoutDashboard },
  { href: "/productivity", label: "Productivity", icon: Activity },
  { href: "/business", label: "Business", icon: Briefcase },
  { href: "/finance", label: "Finance", icon: LineChart },
  { href: "/reading", label: "Reading", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-[230px] shrink-0 flex-col gap-4 border-r border-white/5 bg-black/20 backdrop-blur-xl px-4 py-5">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-nx-accent/30 to-nx-violet/30 ring-glow grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="absolute -inset-1 rounded-2xl border border-white/10 animate-pulseRing" />
        </div>
        <div className="leading-tight">
          <div className="holo-text text-sm font-semibold tracking-widest">NEXUS</div>
          <div className="text-[10px] text-nx-dim tracking-[0.2em]">PERSONAL · OS</div>
        </div>
      </Link>

      <div className="hairline my-1" />

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-white/[0.06] text-white"
                  : "text-nx-dim hover:text-white hover:bg-white/[0.03]"
              )}
            >
              {active && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl ring-1 ring-nx-accent/30 shadow-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon className={clsx("h-4 w-4 relative", active && "text-nx-accent")} />
              <span className="relative tracking-wide">{item.label}</span>
              {active && (
                <span className="ml-auto relative h-1.5 w-1.5 rounded-full bg-nx-accent shadow-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="glass p-3">
          <div className="label mb-2">System Status</div>
          <div className="space-y-1.5 text-[11px]">
            <Row k="UPLINK" v="STABLE" tone="green" />
            <Row k="CORE" v="98.4%" tone="cyan" />
            <Row k="SYNC" v="LOCAL" tone="violet" />
          </div>
        </div>
        <Link href="/settings" className="flex items-center gap-2 px-2 text-xs text-nx-dim hover:text-white transition">
          <Settings className="h-3.5 w-3.5" /> Settings
        </Link>
      </div>
    </aside>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone: "green" | "cyan" | "violet" }) {
  const dot = tone === "green" ? "bg-nx-green" : tone === "cyan" ? "bg-nx-accent" : "bg-nx-violet";
  return (
    <div className="flex items-center justify-between">
      <span className="text-nx-dim tracking-widest">{k}</span>
      <span className="flex items-center gap-1.5 text-white/80">
        <span className={clsx("h-1.5 w-1.5 rounded-full shadow-glow", dot)} />
        {v}
      </span>
    </div>
  );
}
