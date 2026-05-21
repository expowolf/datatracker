import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: "#05070d",
          panel: "rgba(15,22,38,0.55)",
          line: "rgba(120,170,255,0.12)",
          cyan: "#5eead4",
          accent: "#7dd3fc",
          violet: "#a78bfa",
          rose: "#fb7185",
          amber: "#fbbf24",
          green: "#34d399",
          dim: "#7c8aa8",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
        mono: ["ui-monospace", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(125,211,252,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)",
        radial:
          "radial-gradient(800px 500px at 20% 0%, rgba(125,211,252,0.12), transparent 60%), radial-gradient(700px 500px at 90% 20%, rgba(167,139,250,0.10), transparent 60%)",
      },
      animation: {
        pulseRing: "pulseRing 3.2s ease-out infinite",
        floaty: "floaty 7s ease-in-out infinite",
        shine: "shine 6s linear infinite",
        scan: "scan 4s linear infinite",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
