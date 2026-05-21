"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

export function Stat({
  label,
  value,
  delta,
  hint,
  icon,
  tone = "cyan",
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "cyan" | "violet" | "green" | "amber" | "rose";
}) {
  const dot =
    tone === "green" ? "bg-nx-green" :
    tone === "violet" ? "bg-nx-violet" :
    tone === "amber" ? "bg-nx-amber" :
    tone === "rose" ? "bg-nx-rose" : "bg-nx-accent";
  const positive = delta?.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-4 relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="label flex items-center gap-1.5">
          <span className={clsx("h-1.5 w-1.5 rounded-full shadow-glow", dot)} />
          {label}
        </span>
        {icon && <span className="text-nx-dim">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-[11px]">
        {delta && (
          <span className={clsx("font-mono", positive ? "text-nx-green" : "text-nx-rose")}>
            {delta}
          </span>
        )}
        {hint && <span className="text-nx-dim">{hint}</span>}
      </div>
    </motion.div>
  );
}
