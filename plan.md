# The Fork — MVP Plan

## Goal
A single-page experience where a user writes the “fork” decision that split their life, picks an intensity (Mild/Savage/Brutal), then chats with an alter-ego who chose the other path. No accounts, no saved history.

## Stack
- Frontend: React SPA (CRA) + Tailwind for styling (moody, distressed “confessional booth” look)
- Backend: FastAPI
- LLM: OpenAI via `emergentintegrations` using `EMERGENT_LLM_KEY`
- DB: **Not used** (as requested). Server stays stateless. Client holds conversation in memory.

## Architecture

### Frontend
- One route: `/`
- App state:
  - `forkStatement` (string)
  - `intensity` (enum: mild/savage/brutal)
  - `sessionId` (uuid stored in localStorage for 10–30min reset on "Burn"; also sent with each request)
  - `messages` (array: {id, role: 'user'|'alter', content, createdAt})
  - `started` boolean
- Components:
  - `ForkSetup` (prompt input + intensity toggle + primary CTA)
  - `ForkSummaryBar` (sticky collapsed pill with truncated fork + intensity badge; appears after start)
  - `ChatWindow`
    - `ChatHeader` (fork summary, intensity)
    - `MessageList` (left/right bubbles + avatar badges)
    - `Composer` (textarea, Enter to send, Shift+Enter newline)
    - `TypingIndicator` (tone-aware)
  - `ResetModal` (confirm destructive reset)

### Backend
- Endpoint:
  - `POST /api/chat`
    - payload: `{ forkStatement: string, intensity: 'mild'|'savage'|'brutal', messages: [{role:'user'|'assistant', content:string}], sessionId: string }`
    - returns: `{ reply: string }`
- Stateless: no DB writes, no history storage.
- Guardrails:
  - Minimal content checks to avoid self-harm instructions/hate/harassment.
  - If self-harm risk detected: return grounding response + resources.

## Prompting / Character Contract
- System message builds the alter-ego persona:
  - First-person voice
  - Explicitly references fork statement as lived history
  - Never breaks character, never says “as an AI”
  - Asks sharp follow-ups; calls out self-delusion more as intensity increases
  - Brutal = no comfort, can be blunt/profane, but **non-abusive** (no slurs/threats)

## UI/UX (Dark Confessional)
- Palette: charcoal/ink blacks, distressed dark metallics, deep crimson accents, subtle chrome highlights
- Setup: “confession booth” panel with tagline: “One decision. One alternate you. No refunds.”
- After start: setup collapses into sticky pill
- Chat: left/right bubbles; alter-ego bubble textured/contrasting

## Testing Approach
- Backend
  - `curl` POST `/api/chat` with a sample fork + message and verify non-empty reply.
  - Safety test: self-harm text triggers grounding message.
- Frontend
  - Playwright: start flow, send message, receive reply, reset.
  - Validate `data-testid` on all interactive + critical text elements.
