# PoliticalPulse Architecture

## Mission

People don't need more political news.
They need better tools to understand it.

---

# Technology Stack

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend
- Next.js API Routes

AI
- OpenAI

Hosting
- Vercel

Source Control
- GitHub

---

# Project Structure

app/
components/
lib/
docs/
types/

---

# AI Layer

lib/ai

Responsibilities:

- Prompt generation
- Response normalization
- Timeline engine
- Story memory
- Consensus engine
- Fact checking
- Future AI services

---

# Design Principles

1. AI logic stays out of UI components.

2. Components only render data.

3. API routes orchestrate requests.

4. Shared logic belongs in lib/.

5. Normalize all AI responses before the UI uses them.

6. Prefer reusable services over duplicated code.

---

# Long-Term Vision

PoliticalPulse becomes an AI-powered political intelligence platform that helps people understand complex political events through objective analysis, historical context, and multiple perspectives.