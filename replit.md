# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Includes a WhatsApp bot built with Baileys (unofficial WhatsApp Web API) running alongside an Express API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **WhatsApp**: @whiskeysockets/baileys

## WhatsApp Bot Features

- **Delete message spy** — captures deleted messages, forwards to owner DM
- **View-once media forwarder** — detects and forwards view-once messages to owner
- **Trivia game** — random trivia questions with timer
- **Truth or Dare** — truth/dare questions
- **Rock Paper Scissors** — `.rps rock/paper/scissors`
- **Math challenge** — timed math questions
- **AI chat** — conversational replies via `.chat`
- **Status grabber** — fetch user status/profile pic via `.status`
- **Alive / Uptime** — `.alive`, `.uptime`, `.ping`
- **Command menu** — `.menu`
- **Public/Private mode** — `.public` / `.private` (owner only)

## Bot Configuration (Environment Variables)

- `OWNER_NUMBER` — Your WhatsApp number (digits only, e.g. `1234567890`). Required for delete spy & view-once forwarding.
- `BOT_NAME` — Display name for the bot (default: `WhatsBot`)

## Command Prefix

Default prefix is `.` — all commands start with `.` (e.g. `.menu`, `.trivia`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server + bot locally

## Bot Files

- `artifacts/api-server/src/bot/index.ts` — main bot entry point
- `artifacts/api-server/src/bot/config.ts` — bot configuration
- `artifacts/api-server/src/bot/store.ts` — in-memory state (deleted messages, chat history, uptime)
- `artifacts/api-server/src/bot/handlers/commands.ts` — all command handlers
- `artifacts/api-server/src/bot/handlers/messageDelete.ts` — deleted message detection
- `artifacts/api-server/src/bot/handlers/viewOnce.ts` — view-once media forwarding
- `artifacts/api-server/src/bot/handlers/status.ts` — user status grabber
- `artifacts/api-server/src/bot/games/` — trivia, truth/dare, rps, math games

## Connecting the Bot

1. Start the server — a QR code appears in the console logs
2. Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
3. Scan the QR code
4. Bot is now connected!

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
