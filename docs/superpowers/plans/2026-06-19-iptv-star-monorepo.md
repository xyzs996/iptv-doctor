# IPTV Star Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working monorepo with six star-oriented IPTV/sports projects sharing one legal data and tooling foundation.

**Architecture:** Shared TypeScript packages own sports data, EPG generation, and IPTV playlist parsing. Apps and CLIs wrap those packages into independently publishable GitHub projects: World Cup TV guide, IPTV doctor, spoiler-free viewer, MCP server, public sports TV index, and the generic match2epg CLI.

**Tech Stack:** pnpm workspaces, TypeScript, Vitest, Vite, React, Node CLI, MCP SDK.

---

### Task 1: Workspace Skeleton

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`

- [x] **Step 1: Add root workspace config**

Create a private pnpm workspace with shared TypeScript, Vitest, Vite, React, lucide-react, and MCP SDK dependencies.

- [x] **Step 2: Add package references**

Reference all shared packages and apps so `pnpm typecheck` can validate the full workspace.

### Task 2: Test-First Core Packages

**Files:**
- Create: `packages/sports-data/src/worldcup2026.test.ts`
- Create: `packages/match2epg/src/generators.test.ts`
- Create: `packages/iptv-core/src/m3u.test.ts`

- [x] **Step 1: Write failing tests**

Tests define the desired APIs for match data, XMLTV/iCal/M3U generation, and M3U parsing.

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test`

Expected: tests fail because implementation modules are missing.

### Task 3: Implement Core Packages

**Files:**
- Create: `packages/sports-data/src/types.ts`
- Create: `packages/sports-data/src/worldcup2026.ts`
- Create: `packages/sports-data/src/publicSportsChannels.ts`
- Create: `packages/sports-data/src/index.ts`
- Create: `packages/match2epg/src/generators.ts`
- Create: `packages/match2epg/src/cli.ts`
- Create: `packages/match2epg/src/index.ts`
- Create: `packages/iptv-core/src/m3u.ts`
- Create: `packages/iptv-core/src/report.ts`
- Create: `packages/iptv-core/src/index.ts`

- [ ] **Step 1: Add minimal implementations to satisfy tests**

Implement deterministic sample World Cup fixtures, broadcaster mappings, XMLTV, iCal, placeholder M3U generation, M3U parsing, and HTML report rendering.

- [ ] **Step 2: Run tests and verify GREEN**

Run: `pnpm test`

Expected: all core tests pass.

### Task 4: Implement Six Entrypoints

**Files:**
- Create: `apps/worldcup-tv-guide/*`
- Create: `apps/iptv-doctor/*`
- Create: `apps/spoiler-free-iptv/*`
- Create: `apps/wc26-mcp-tv/*`
- Create: `apps/public-sports-tv-index/*`
- Create: `packages/match2epg/README.md`
- Create: project READMEs for each app

- [ ] **Step 1: Add World Cup TV Guide**

Create a Vite React app that exposes schedule, legal viewing options, and export previews.

- [ ] **Step 2: Add IPTV Doctor**

Create a Node CLI that parses M3U files and writes an HTML diagnostics report.

- [ ] **Step 3: Add Spoiler-Free IPTV**

Create a Vite React app that shows matches without scores and supports hide/reveal behavior.

- [ ] **Step 4: Add WC26 MCP TV**

Create an MCP server exposing schedule, legal viewing, and EPG generation tools.

- [ ] **Step 5: Add Public Sports TV Index**

Create a Vite React app showing legal public sports channels with source evidence fields.

### Task 5: Verify Workspace

**Files:**
- Modify: all created files as needed.

- [ ] **Step 1: Install dependencies**

Run: `pnpm install`

- [ ] **Step 2: Run tests**

Run: `pnpm test`

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`

- [ ] **Step 4: Run builds**

Run: `pnpm build`

### Self-Review

- Spec coverage: The plan covers the six requested projects plus the shared monorepo foundation.
- Placeholder scan: No implementation placeholders are intended in shipped code; the plan tasks are concrete for this MVP.
- Type consistency: Shared package names use the `@iptv-star/*` namespace throughout.
