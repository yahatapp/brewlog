# GEMINI.md

## Project Overview

- **Name:** Brewlog
- **Description:** A lightweight coffee brewing log application for personal/couple use, running as a LINE LIFF App.
- **Infrastructure:** Cloudflare Workers (Backend & Static Assets) + Supabase (PostgreSQL).

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Hono (Cloudflare Workers)
- **Database:** Supabase + Drizzle ORM
- **UI Framework:** shadcn/ui (Base UI Edition) + Tailwind CSS
- **Authentication:** LIFF ID Token Verification (Custom Auth in Hono)
- **Tooling:**
  - **Package Manager:** `pnpm`
  - **Unified Toolchain:** `Vite+` (`vp` CLI) for Linting, Formatting, and Type-checking.

## Development Environment

- **Management:** Nix + direnv (`flake.nix`)
  - The following tools are managed automatically via Nix:
    - Node.js (v24)
    - pnpm (v10.x)
    - git
  - **Setup:**
    - Run `direnv allow` to activate the environment.
    - When modifying or creating `flake.nix`, ensure it is tracked by Git (e.g., `git add flake.nix`) so Nix can recognize it.

## Commands

- **Install:** `pnpm install`
- **Development:** `vp dev`
- **Build:** `vp build`
- **Lint/Format/Type-check:** `vp check`
- **Auto-fix:** `vp check --fix`
- **Testing:** `vp test`
- **Database Migration:**
  - Generate: `pnpm run db:generate`
  - Migrate: `pnpm run db:migrate`

## Coding Standards & Rules

- **Type Safety:** Always use TypeScript. Ensure Hono RPC (`AppType`) is used for end-to-end type safety between frontend and backend.
- **Formatting & Linting:**
  - Use `vp check` before any commit or after significant changes.
  - Follow the Oxc-based rules integrated in Vite+.
- **Directory Structure:**
  - `src/`: Frontend React application.
  - `src/api/`: Backend Hono application (Cloudflare Workers).
  - `db/`: Database schema and migrations.
  - `docs/`: Design documents and decisions (Always refer to these).
- **Security:**
  - NEVER commit secrets or `.env` files.
  - Authentication must follow the flow defined in `docs/auth-flow.md` (ID Token validation + Allowlist).
- **Communication:**
  - Refer to `docs/database-design.md` for any schema changes.
  - Keep the application lightweight and optimized for Cloudflare Workers/Pages.

## Agent Instructions

- Use `pnpm` for adding/removing packages.
- Run `vp check --fix` automatically after modifying code to ensure style consistency.
- When creating new UI components, prioritize `shadcn/ui` with `Base UI` primitives.
- Always check `docs/tech-stack.md` for the latest architectural decisions.
