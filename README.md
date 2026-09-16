# Sterling — Intelligent AI Research Agent & Assistant Desk

<p align="left">
  <img src="https://img.shields.io/badge/Runtime-Bun%201.4%2B-FBF0DF?style=for-the-badge&logo=bun&logoColor=000000" alt="Bun" />
  <img src="https://img.shields.io/badge/TypeScript-Strict%207-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-16.3%20App%20Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/AI%20SDK-Vercel%20AI%20v7-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel AI SDK" />
  <img src="https://img.shields.io/badge/Search-Exa%20AI-00F0FF?style=for-the-badge" alt="Exa AI" />
  <img src="https://img.shields.io/badge/Storage-Dexie%20IndexedDB-10B981?style=for-the-badge" alt="Dexie" />
</p>

Sterling is a fast, high-signal AI research assistant and intelligence desk built with Next.js 16, Vercel AI SDK, and Exa AI neural search.

![Sterling AI Agent Desk](public/images/homescreen.webp)

---

## Key Features

- **Autonomous Research Engine**: Real-time multi-step thinking with Exa AI web search & breaking news briefings.
- **Multi-Session Workspace**: Persistent conversation threads with 0ms switching via Dexie IndexedDB.
- **Adaptive Thinking Timeline**: Real-time SSE stream rendering for thought steps, tools, and token metrics.
- **Modern Design System**: Sleek dark/light theme, custom scroll orchestration, and Framer Motion micro-animations.

---

## Quick Start

### 1. Requirements
- [Bun](https://bun.sh/) `1.4.0+`

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
FIREWORKS_API_KEY=your_fireworks_api_key
EXA_API_KEY=your_exa_api_key
```

### 4. Run Development Server
```bash
bun run dev
```

---

## Verification & Tooling

```bash
# Type check with TS7
bun x tsc --noEmit

# Lint with Oxlint
bun run lint

# Production build
bun run build
```