# AIOScore.org (AIO Score) – Next.js SaaS MVP

Production-ready starter SaaS app for measuring AI visibility via an **AIO Score** (AI readiness, GEO, AI inclusion, SEO foundations).

## Stack
- Next.js 14 App Router + TypeScript + Tailwind
- Supabase auth/database/email verification
- Stripe subscription placeholders
- OpenAI API for dynamic scoring and member assistant (fallback to deterministic mock data)

## Features Included
- Premium marketing homepage with centered URL scan input
- Auth flow: register, login, logout-ready structure, forgot/reset password, verify-email page
- Verification gate before scan results
- Scan creation API with free-tier gating logic (account + IP + device starter checks)
- Dashboard with profile, scan history, usage status, subscription status
- Scan report with five score categories, partial locking for free users, upgrade CTA
- Member AI assistant panel on scan page
- Pricing, terms, privacy, contact pages
- Supabase schema migration for profiles, scans, scan_results, usage_limits, subscriptions, email_preferences

## Local Setup
1. Copy env:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in Supabase + OpenAI + Stripe values.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## Supabase Setup
- Run SQL from `supabase/migrations/0001_init.sql` in your Supabase SQL editor.
- Configure Auth email templates and set redirect URLs:
  - `http://localhost:3000/verify-email`
  - `http://localhost:3000/reset-password`

## Stripe Placeholder
- Pricing buttons hit `/api/stripe/checkout?plan=starter|pro`.
- If Stripe env values are missing, route safely redirects to a pricing placeholder state.

## Notes / TODO for production hardening
- Replace mock scoring and prompt-based scoring with real crawler + deterministic scoring engine.
- Add strict zod validation over all AI outputs.
- Harden free-scan abuse prevention beyond basic IP/device checks.
- Add robust logging, audit trails, and rate limiting.
- Add webhook-driven Stripe subscription syncing.<<<<<<< codex/build-production-ready-website-for-aioscore.org-frmh
