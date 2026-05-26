# Transformer Dielectric Health Monitor (TDHM)

Industrial AI dashboard for transformer insulation dielectric health monitoring. Built with Next.js, React Three Fiber, Framer Motion, and Zustand.

## Quick start

```bash
cd C:/Users/user/Projects/transformer-dielectric-monitor
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend

Ensure your FastAPI server exposes `POST /predict` at the URL in `.env.local` (default `http://localhost:8000`).

The dashboard works **offline**: sliders and the 3D model stay interactive; diagnostics show a disconnected state if the API is unreachable.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- React Three Fiber + Drei (primitive-based 3D transformer)
- Framer Motion, Axios, Zustand

## Project layout

- `app/` — layout, page, global styles
- `components/` — dashboard UI and 3D scene
- `hooks/useTransformerStore.ts` — global state
- `lib/api.ts` — FastAPI client
- `types/index.ts` — shared types and constants
