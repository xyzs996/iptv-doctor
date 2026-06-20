# IPTV Doctor Flagship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Phase 1 `iptv-doctor` flagship capabilities from `docs/project-proposal.md` v2.

**Architecture:** Keep the monorepo, but concentrate public value in `apps/iptv-doctor`. Shared behavior lives in `packages/iptv-core`: parsing, probing, diagnostics, cleaning, report rendering, CSV/JSON, and compliance scanning. `apps/iptv-doctor` becomes a thin CLI over those shared APIs.

**Tech Stack:** TypeScript, Node 24 built-in `fetch`, pnpm workspaces, Vitest, Vite for existing demos.

---

### Task 1: Acceptance Criteria

**Files:**
- Create: `docs/acceptance-criteria.md`
- Modify: `docs/project-proposal.md`

- [x] Add a concrete checklist for Phase 1 release readiness.

### Task 2: Test-First Core Diagnostics

**Files:**
- Create: `packages/iptv-core/src/diagnostics.test.ts`
- Create: `packages/iptv-core/src/clean.test.ts`
- Create: `packages/iptv-core/src/compliance.test.ts`
- Modify: `packages/iptv-core/src/report.ts`

- [x] Write tests for HLS probe classification, segment sampling, clean M3U output, JSON/CSV/HTML report content, EPG matching, and compliance scan failures.
- [x] Run targeted `pnpm test` commands and verify tests fail because implementations are missing.
- [x] Implement diagnostics, segment sampling, clean output, report rendering, EPG matching/fixing, and compliance scan.
- [x] Run targeted `pnpm test` commands and verify tests pass.

### Task 3: CLI Subcommands

**Files:**
- Create: `apps/iptv-doctor/src/cli.test.ts`
- Modify: `apps/iptv-doctor/src/cli.ts`
- Modify: `apps/iptv-doctor/package.json`
- Modify: `package.json`

- [x] Write CLI tests for `check`, `clean`, `epg`, `badge`, and `worldcup`.
- [x] Run targeted `pnpm test` commands and verify tests fail because subcommands are missing.
- [x] Implement the subcommands as thin wrappers over shared packages.
- [x] Run targeted `pnpm test` commands and verify tests pass.

### Task 4: Release Readiness Files

**Files:**
- Create: `.gitignore`
- Create: `LICENSE`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/iptv-health-example.yml`
- Modify: `README.md`
- Modify: `apps/iptv-doctor/README.md`

- [x] Add release hygiene files, issue template, Dockerfile, publish workflow, and a copyable GitHub Actions health-check template.
- [x] Rewrite README surfaces around `iptv-doctor` flagship positioning.

### Task 5: Verification

**Files:**
- Modify: all touched files as needed.

- [x] Run `pnpm test`.
- [x] Run `pnpm typecheck`.
- [x] Run `pnpm build`.
- [x] Run smoke commands for `check`, `clean`, `epg`, `badge`, and `worldcup`.
- [x] Update `docs/acceptance-criteria.md` checkboxes for proven items only.
