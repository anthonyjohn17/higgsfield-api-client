## Repo Overview

**`higgsfield-api-client` is a small, publishable TypeScript SDK** for calling **HiggsField.ai** backend APIs from Node (and similar environments). It is **not** the official HiggsField web app or server; it is a **third-party HTTP client** that maps browser-observed endpoints into typed-ish modules.

- **Package**: `higgsfield-api-client` at **v0.1.0**, **MIT**, **Node ≥ 18**, **ESM + CJS** via **tsup**, **`sideEffects: false`** ([`package.json`](package.json)).
- **Public surface**: Root [`index.ts`](index.ts) re-exports `HiggsFieldClient`, `HiggsFieldError`, and a few config/types.

## Technical shape

1. **Facade client** — [`HiggsFieldClient`](src/client/index.ts) owns one shared [`HttpClient`](src/client/http.ts) and exposes **14 domain services**: user, workspace, subscription, asset, job, folder, community, notification, cms, clerk, score, misc, generation.

2. **Multi-host routing** — [`HttpClient`](src/client/http.ts) maps logical names (`fnf`, `community`, `notification`, `cms`, `clerk`, `fnfScore`) to fixed `*.higgsfield.ai` bases, builds URLs, applies timeouts, parses JSON (and passes through SSE-ish responses).

3. **Auth** — Either a **short-lived JWT** (`token`) or **Clerk session + client token**, with **automatic JWT refresh** by POSTing to Clerk’s session tokens endpoint (`Bearer` client token). Optional **`datadome`** cookie header for experiments around bot protection.

4. **Errors** — [`HiggsFieldError`](src/types/index.ts) wraps HTTP failures with status and body.

5. **Generation / jobs** — [`GenerationService`](src/client/services/generation.ts) implements create job (`POST /jobs/{type}`), poll status, fetch job, and `waitForCompletion`. [`JobSetType`](src/client/services/job.ts) is a long union of job-set identifiers (image/video-oriented names), indicating the client was aligned to **real product capabilities**.

## How it was likely built

README and structure point to **API discovery from the live product** (cookie names, multiple services, Clerk version string `2025-11-10`), not a vendor-published OpenAPI-only SDK. That fits a **community / personal automation** library rather than an officially maintained API contract.

## Limitations called out in-repo

The README is explicit: **read paths work from CLI**; **`POST` generation jobs are guarded by DataDome/Cloudflare**, so naive server-side `fetch` often gets **403**. The code still exposes generation for completeness or for use behind a real browser / automation the README describes.

## Repo maturity and gaps

| Aspect | Observation |
|--------|----------------|
| **Size** | ~26 tracked files; focused library, no app shell. |
| **Tests** | **No** test directory or scripts in `package.json` — validation is **typecheck + Biome + manual examples**. |
| **Examples** | [`examples/usage.ts`](examples/usage.ts), [`examples/generate.ts`](examples/generate.ts) — env-driven smoke usage. |
| **Tooling** | TypeScript 5.x, Biome, pnpm lockfile — modern and minimal. |

## Bottom line

This repo is an **early-stage (0.1.0), dependency-free TypeScript HTTP wrapper** around **HiggsField.ai’s Clerk-authenticated, multi-service backend**, oriented toward **scripts and integrations**. It is **fully wired for many read/list/detail flows** and **documents hard limits on unattended generation** due to **bot protection**. Treat it as **unofficial** and **contract-unstable** relative to whatever HiggsField ships in production over time.
