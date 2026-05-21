"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

export function Heatmap({ data, cols = 7 }: { data: number[]; cols?: number }) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {data.map((v, i) => {
        const tone =
          v === 0
            ? "bg-white/[0.04]"
            : v === 1
            ? "bg-nx-accent/20"
            : v === 2
            ? "bg-nx-accent/40"
            : v === 3
            ? "bg-nx-accent/65"
            : "bg-nx-accent/90 shadow-glow";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.008 }}
            className={clsx("h-5 w-full rounded-md border border-white/5", tone)}
            title={`Level ${v}`}
          />
        );
      })}
    </div>
  );
}
