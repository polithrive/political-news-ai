<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The Angle Report — Agent Instructions

## Project

- Product: The Angle Report
- Stack: Next.js 16, TypeScript, Tailwind, OpenAI, NewsAPI, Neon/Postgres, Drizzle, Vercel
- This repository is production-oriented. Existing working functionality must be protected.
- Git checkpoints mark completed phases. Do not treat an uncommitted working tree as a protected baseline.

## Workflow

Before substantial work, read:

- `docs/development/CURRENT_PHASE.md`
- `docs/development/ARCHITECTURE.md`
- `docs/development/DECISIONS.md`
- `docs/development/HANDOFF.md`

Then inspect the actual code. Do not assume architecture from these docs if the repository differs.

- Prefer small additive changes.
- Do not perform broad refactors unless specifically authorized.
- Do not proceed into the next development phase without explicit authorization.
- Never expose or commit secrets (including `.env.local`, `DATABASE_URL` values, and API keys).
- Preserve evidence-grounding and provenance safeguards.
- Run appropriate validation before recommending a checkpoint.
- Use Git checkpoints only for completed, authorized phases.

Transient phase state, file lists, and known debt belong in `docs/development/`, not here.

## Handoff

At the end of substantial work, update `docs/development/HANDOFF.md`.

`HANDOFF.md` is the mailbox for the next engineering agent. It must contain enough facts (phase, checkpoint, files, behavior, validation, debt, Git state) to review the work without the previous chat transcript.
