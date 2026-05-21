"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
  glow = false,
  delay = 0,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.9, 0.3, 1] }}
      className={clsx(
        "panel relative overflow-hidden group",
        glow && "ring-1 ring-nx-accent/15 shadow-glow",
        className
      )}
    >
      <div className="pointer-events-none absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
      {(title || right) && (
        <div className="flex items-start justify-between mb-3">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-nx-accent shadow-glow" />
                <h3 className="text-sm font-medium tracking-wide text-white/90">{title}</h3>
              </div>
            )}
            {subtitle && <p className="label mt-1">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </motion.div>
  );
}
