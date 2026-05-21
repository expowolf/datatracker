# NEXUS — Personal OS

A cinematic, single-user personal operating system for productivity, business growth, finance tracking, and reading. Built for Vercel.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Zustand (localStorage persistence)
- Recharts + lucide-react

## Develop
```bash
npm install
npm run dev
```

## Deploy
Push to GitHub and import into Vercel. Zero config required.

## Data
All state lives in `localStorage` under `nexus-os-store`. Reset from `/settings`.

## Sections
- `/` Command Center
- `/productivity` Performance Lab
- `/business` Business Engine + CRM
- `/finance` Capital Flow + Portfolio
- `/reading` Library Core
