"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = { id: string; title: string; done: boolean; tag?: string; due?: string };
export type Habit = { id: string; name: string; streak: number; days: boolean[] };
export type Lead = {
  id: string;
  name: string;
  channel: string;
  status: "new" | "contacted" | "replied" | "closed";
  value?: number;
  note?: string;
};
export type Book = { id: string; title: string; author: string; pages: number; read: number };
export type Holding = { id: string; symbol: string; shares: number; cost: number; price: number };

type Focus = { active: boolean; startedAt: number | null; durationMin: number };

type State = {
  tasks: Task[];
  habits: Habit[];
  leads: Lead[];
  books: Book[];
  holdings: Holding[];
  focus: Focus;
  weeklyHours: { day: string; deep: number; distract: number }[];
  heatmap: number[]; // 49 days
  toggleTask: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "done">) => void;
  toggleHabit: (id: string, dayIndex: number) => void;
  setFocus: (f: Partial<Focus>) => void;
  addLead: (l: Omit<Lead, "id">) => void;
  setLeadStatus: (id: string, status: Lead["status"]) => void;
  addBookPages: (id: string, n: number) => void;
  dailyScore: () => number;
  weeklyMomentum: () => number;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      tasks: [
        { id: "1", title: "Ship landing v2", done: false, tag: "Business" },
        { id: "2", title: "Cold outreach × 5", done: true, tag: "Outreach" },
        { id: "3", title: "Deep work — 90m", done: false, tag: "Focus" },
        { id: "4", title: "Review portfolio rebalance", done: false, tag: "Finance" },
        { id: "5", title: "Read 30 pages", done: true, tag: "Reading" },
      ],
      habits: [
        { id: "h1", name: "Deep Work", streak: 12, days: [true, true, true, false, true, true, true] },
        { id: "h2", name: "Workout", streak: 5, days: [true, false, true, true, true, false, true] },
        { id: "h3", name: "Reading", streak: 21, days: [true, true, true, true, true, true, true] },
        { id: "h4", name: "No Social", streak: 3, days: [false, true, true, false, true, true, false] },
      ],
      leads: [
        { id: "l1", name: "Coastal Dental Co.", channel: "Email", status: "contacted", value: 1200 },
        { id: "l2", name: "Vertex Auto Repair", channel: "Cold Call", status: "replied", value: 2400 },
        { id: "l3", name: "Lumen Studio", channel: "DM", status: "new", value: 1800 },
        { id: "l4", name: "Northwind Cafe", channel: "Email", status: "closed", value: 900 },
      ],
      books: [
        { id: "b1", title: "Atomic Habits", author: "James Clear", pages: 320, read: 220 },
        { id: "b2", title: "Deep Work", author: "Cal Newport", pages: 296, read: 96 },
        { id: "b3", title: "The Almanack", author: "E. Jorgenson", pages: 244, read: 244 },
        { id: "b4", title: "Principles", author: "Ray Dalio", pages: 592, read: 110 },
      ],
      holdings: [
        { id: "p1", symbol: "NVDA", shares: 12, cost: 420, price: 920 },
        { id: "p2", symbol: "AAPL", shares: 18, cost: 165, price: 212 },
        { id: "p3", symbol: "TSLA", shares: 8, cost: 240, price: 258 },
        { id: "p4", symbol: "BTC", shares: 0.3, cost: 38000, price: 71500 },
      ],
      focus: { active: false, startedAt: null, durationMin: 25 },
      weeklyHours: days.map((d, i) => ({
        day: d,
        deep: [5.2, 6.1, 4.8, 7.0, 5.5, 3.2, 1.6][i],
        distract: [2.0, 1.4, 2.6, 1.2, 1.8, 3.2, 2.0][i],
      })),
      heatmap: Array.from({ length: 49 }, (_, i) => Math.round(Math.random() * 4)),

      toggleTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      addTask: (t) =>
        set((s) => ({ tasks: [{ id: crypto.randomUUID(), done: false, ...t }, ...s.tasks] })),
      toggleHabit: (id, dayIndex) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? { ...h, days: h.days.map((d, i) => (i === dayIndex ? !d : d)) }
              : h
          ),
        })),
      setFocus: (f) => set((s) => ({ focus: { ...s.focus, ...f } })),
      addLead: (l) => set((s) => ({ leads: [{ id: crypto.randomUUID(), ...l }, ...s.leads] })),
      setLeadStatus: (id, status) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)) })),
      addBookPages: (id, n) =>
        set((s) => ({
          books: s.books.map((b) =>
            b.id === id ? { ...b, read: Math.min(b.pages, b.read + n) } : b
          ),
        })),

      dailyScore: () => {
        const s = get();
        const taskRate = s.tasks.length ? s.tasks.filter((t) => t.done).length / s.tasks.length : 0;
        const today = s.weeklyHours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
        const focusRatio = today ? today.deep / Math.max(0.1, today.deep + today.distract) : 0;
        return Math.round((taskRate * 0.5 + focusRatio * 0.5) * 100);
      },
      weeklyMomentum: () => {
        const s = get();
        const deep = s.weeklyHours.reduce((a, b) => a + b.deep, 0);
        const dist = s.weeklyHours.reduce((a, b) => a + b.distract, 0);
        return Math.round((deep / Math.max(1, deep + dist)) * 100);
      },
    }),
    { name: "nexus-os-store" }
  )
);
