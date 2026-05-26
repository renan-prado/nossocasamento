# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Bun (see `bun.lock`), but npm/package-lock.json is also present.

- `bun dev` — start Next.js dev server on **port 3001** (not 3000)
- `bun run build` — production build
- `bun start` — run production build
- `bun run lint` — Biome check (lint + format check)
- `bun run format` — Biome format with `--write`

No test framework is configured.

## Environment

Required env vars (see `.env.example`):
- `NEXT_PUBLIC_FIREBASE_*` — Firebase web SDK config (client-side; missing values throw at runtime in `src/firebase/client.ts`)
- `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_WEBHOOK_SECRET` — Mercado Pago server credentials

## Architecture

Next.js 16 App Router site for a wedding (Renan & Danielle). Public landing/RSVP/gift pages plus an `/admin` console. State and persistence are split between client-side Firestore and server-side route handlers for payments.

### Routing layout (`src/app/`)
- `/` — minimal landing page (`page.tsx`)
- `/danielle-e-renan` — main client-rendered wedding page composed of `SnapSection`s (hero, menu, about, RSVP, gifts, mosaic). Uses CSS scroll-snap for full-screen sections.
- `/admin/*` — admin console with its own `layout.tsx` that forces light color scheme. Includes `cadastrar-convidado`, `presentes`, `mensagens`, `tchubiraudau` (auth/lookup). Note: no auth middleware — admin routes are unguarded.
- `/api/gifts` — REST proxy for gift CRUD
- `/api/mercadopago/checkout` — creates a Mercado Pago `preference` from a cart and saves the guest message (`src/firebase/messages.ts`) before redirect
- `/api/mercadopago/webhook` — receives payment notifications
- `/presentes/sucesso` — post-payment confirmation

### Data layer (`src/firebase/`)
Firestore collections accessed via the **client SDK** (not Admin SDK) even from server route handlers — `getFirestoreDb()` lazily initializes a singleton app. Collections:
- `gifts` — gift registry items (`gifts.ts`, type `Gift` with `available` boolean — replaced legacy `unique` field per recent commits)
- `guests` — RSVP list (`guests.ts`)
- `messages` — guest messages saved at checkout (`messages.ts`)
- `purchases` — completed gift purchases (`purchases.ts`)

### Client state
Zustand stores in `src/store/`:
- `cart-store.ts` — gift cart (in-memory, not persisted)
- `toast-store.ts` — toast notifications, rendered by `ToastContainer`

### UI
- Tailwind CSS v4 via `@tailwindcss/postcss`. Global CSS in `src/app/globals.css`.
- shadcn/ui set up (`components.json`, base color slate, Lucide icons). Primitives live in `src/components/ui/`.
- Custom local fonts loaded via `next/font/local` in root layout: `geist-sans`, `niconne` (script accents), `petit-formal-script` (serif). Color palette uses custom names like `bg-bege`, `text-green`.
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts` + `babel-plugin-react-compiler`). Avoid manual `useMemo`/`useCallback` micro-optimizations.

### Conventions
- Biome (v2.2) is the only linter/formatter — 2-space indent, organize-imports on save. Next + React lint domains enabled.
- Path alias `@/*` → `src/*`.
- Money is stored as integer cents in Firestore; convert to decimal (`price / 100`) only at the Mercado Pago boundary.
- Image `remotePatterns` allows any HTTPS host (`hostname: "**"`).
