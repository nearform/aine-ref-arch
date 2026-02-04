# Nearform POV: AI‑Native Engineering & Spec‑Driven Development (Doctrine)

> Status: draft v0.1 (for review)

## 1) What we mean by AI‑native engineering
AI‑native engineering is not “adding Copilot.” It is an end‑to‑end engineering approach where we treat foundation models and agents as first‑class participants in the software delivery lifecycle.

In practice, that means we shift from a code‑centric workflow (“write code, then explain it”) to an intent‑centric workflow (“write down what we mean, then generate/validate code against it”).

**Key point:** models are powerful, but they are *not* good at filling gaps safely. When requirements are ambiguous, humans ask clarifying questions; models often hallucinate. Our approach exists to front‑load clarity so models can move faster without creating chaos.

## 2) The maturity ladder (how teams evolve)
We see a practical progression:

1. **AI‑assisted** — line‑by‑line autocomplete and suggestions.
   - Helps locally, but doesn’t transform delivery.
2. **Agentic (multi‑file)** — agents working across a repo.
   - Measurable speedups, but tends to hit a ceiling.
3. **Spec‑driven development (SDD)** — specs as the steering wheel.
   - Today’s “state of the art” for reliability and scale.
4. **Agentic delivery at scale (multiplayer)** — teams + agents collaborating.
   - The hard frontier: parallelism, merge pressure, governance, and transparency.

## 3) The vibe‑coding trap (and why it doesn’t scale)
Vibe coding is the default “one‑shot prompting” style:
- prompt → code appears → discover missing requirement → patch → discover wrong stack → rewrite → discover partial implementation → iterate → model gets stuck → retools busywork → tokens run out.

The failure modes we see repeatedly:
- **Over‑eagerness:** the model builds features nobody asked for.
- **Under‑completeness:** the model stubs requirements but doesn’t finish them.
- **Non‑determinism:** you can get wildly different outputs run‑to‑run.
- **Busywork loops:** retooling frameworks/tests/logging instead of solving the real issue.

This is why “vibe” approaches can work for throwaway prototypes but become brittle for real MVPs and enterprise work.

## 4) Why specs work (the core mechanism)
Specs work because they force decomposition and explicit decision‑making.

We treat spec‑driven development as a repeatable pipeline:

1. **PRD / Requirements (the what + why)**
   - Define scope, constraints, acceptance criteria.
   - Remove hallucinated requirements.
   - Add the domain context humans know (what “good” looks like).
2. **Technical / Architecture spec (the how)**
   - Codify architecture decisions (e.g., React not Vue).
   - Lock tool choices/versions to reduce arbitrary retooling.
3. **Backlog decomposition (tasks as bounded context windows)**
   - Convert requirements + architecture into discrete tasks.
   - Each task gets “just enough context” to be successful.
4. **Execution with worklogs**
   - Each task produces a worklog: what changed and why.
   - The next task uses the prior worklog as context (N+1 continuity).

The result is higher determinism: fewer wasted cycles, fewer surprises, better quality.

## 5) Our core building blocks (what ships with a project)
We standardize around a small set of artifacts:

- **Requirements doc (PRD):** what/why; acceptance criteria.
- **Architecture/design doc:** how; stack, patterns, constraints.
- **Project constitution (rules):** the “golden rules” the model must not break.
  - (Different tools call this different things: `claw.md`, Cursor rules, etc.)
- **Backlog:** decomposed tasks, each with its own mini‑spec and worklog.
- **Usage specs (when needed):** explicit API/module usage guidance for:
  - very new versions the base model may not know
  - niche modules with limited training signal

## 6) Scale: from single‑player to multiplayer
Today, many spec‑driven IDEs assume a “single contributor” workflow.

We believe real scale requires:

- **Parallel work across multiple contributors** (humans + agents).
- **Specialized roles** instead of one full‑stack generalist agent.
  - e.g., backend / frontend / DevOps responsibilities mapped to different story streams.
- **A staging gate** to handle merge pressure and the agentic pace of change.
  - nobody proceeds without: commit → push → rebase.
- **Backlog visibility** synced into an issue system (Jira/GitHub/Linear) via MCP.

## 7) Tooling we rate (today)
We’re intentionally tool‑agnostic at the *methodology* level (artifacts + gates + validation), but we do have a current “stack” we like.

### Spec‑driven IDEs / workflows
- **Kiro**
  - Explicitly part of our preferred stack.
  - Great on‑ramp for spec‑driven: requirements + design doc + task/backlog workflow.
  - Useful when you want to move quickly while still being disciplined.
- **BMAD method**
  - Best approximation we’ve seen of a comprehensive spec‑driven workflow.
  - Strong on role definitions, workflow structure, and handling large specs (e.g., sharding).
- **Cursor (Plan mode)** (spec‑compatible)
  - Not “pure” SDD, but increasingly converging on the same primitives (planning, decomposition).

### Context & knowledge
- **Tessl usage specs**
  - Critical when we’re depending on:
    - brand‑new library versions the base model hasn’t seen
    - niche/low‑signal modules
  - Used to reduce hallucinations and increase determinism.

### Orchestration & integration
- **MCP connectivity** to issue trackers and systems of record
  - We want backlog ↔ Jira/GitHub/Linear synchronization for transparency and team collaboration.

### Validation
- **Tests as a first‑class output** (unit/integration/E2E) and automated checks
  - Autonomy is proportional to how confidently we can validate.

> Note: this list will evolve quickly; we care more about consistent primitives (PRD → design → backlog → validate) than any single vendor.

## 8) A reference architecture for AI‑native delivery
This is our baseline “how the system fits together” for a spec‑driven project. The goal is repeatability, auditability, and safe acceleration.

### 8.1 Repo layout (specs as first‑class)
We standardize on these names:
- `docs/`
  - `prd.md` (what/why, acceptance criteria)
  - `design.md` (how, architecture decisions)
  - `constitution.md` (golden rules; tool‑specific mirrors allowed)
- `backlog/`
  - `0001-<task>.md` … (each task has context + acceptance + worklog)
- `usage-specs/` (versioned dependency/API usage guidance)
- `src/` (code)
- `tests/` (unit/integration)
- `e2e/` (Playwright/Cypress/etc. when applicable)

### 8.2 Delivery pipeline (the staging gate)
We treat agentic pace of change as a real operational risk.

Minimum bar:
- every task ends with: **commit → push → rebase** (or merge queue)
- CI runs required checks (lint, typecheck, tests)
- no “moving on” when the repo is dirty or behind main

### 8.3 Roles & parallelism (multiplayer mode)
To scale beyond a single contributor:
- break the backlog into **streams aligned to architecture boundaries**
  - frontend stream
  - backend stream
  - platform/DevOps stream
- encode role constraints in:
  - constitution
  - per‑task specs
  - tool/agent role definitions (where supported)

### 8.4 Knowledge injection (usage specs)
When the model’s training signal is insufficient:
- add a `usage-specs/` area (or equivalent) with canonical examples
- reference the relevant usage spec from the task spec
- treat usage specs as versioned artifacts (they change as deps change)

### 8.5 Quality & trust (how autonomy increases)
We increase autonomy when we can prove correctness:
- acceptance criteria written in a testable way
- tests generated/updated alongside features
- “checks” that verify completeness beyond compilation
- staged review: epic‑level review rather than step‑by‑step babysitting, when safe

## 9) Where spec‑driven fits (and where it doesn’t)
### Great fits
- **True MVPs** (not throwaway prototypes).
- **Greenfield builds.**
- **Modernization** (e.g., Node 10 → Node 22): high‑toil work where agents excel.
- **Hard business cases** where cutting timelines changes viability.

### Weaker fits (today)
- **Simple prototypes** where SDD overhead outweighs benefits.
- **Large brownfield codebases** (improving, but still hard).
- **Legacy/proprietary languages** with weak model support (mitigated by usage specs).

## 10) Principles we optimize for
- **Clarity beats cleverness:** ambiguity becomes hallucination.
- **Determinism over novelty:** we want repeatable outcomes.
- **Bounded context wins:** tasks should fit comfortably in a context window.
- **Human review is non‑negotiable** at the spec/architecture phase.
- **Tests are the trust engine:** autonomy increases as validation improves.
- **Tooling should enforce discipline** (gates > guidelines).

## 9) How we talk about the future
We don’t assume the future is “bigger models win.”

We expect progress from:
- **refined interaction techniques** (planning, decomposition, constraint capture)
- **standardized spec primitives** across IDEs/tooling
- **better validation** (automated tests, checks, evals)

Spec‑driven is our best approximation *today*—not a guaranteed end state.

---

## Appendix: Source anchors used for this draft
- YouTube talk transcript: `00_sources/youtube/13EDVjfWKJM.transcript.md`
- Podcast transcript: `00_sources/youtube/WpH3g3kjFus.transcript.md`
- Blog: `00_sources/blog/from-vibe-coding-to-spec-driven-development.md`
- Slides: `00_sources/slides/*.md`
- Analyst: `00_sources/analysts/*` (supporting context only)