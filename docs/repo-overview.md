# Repo Overview

## Purpose

`higgsfield-api-client` is a third-party TypeScript library that performs HTTP calls to HiggsField.ai backend hosts. It is not the official HiggsField application or a vendor-supported SDK.

## Package metadata

| Field | Value |
| --- | --- |
| Name | `higgsfield-api-client` |
| Version | `0.1.0` (see [`package.json`](../package.json)) |
| License | MIT |
| Runtime | Node.js ≥ 18 |
| Module formats | ESM and CJS (`tsup` build) |
| `sideEffects` | `false` |
| Runtime dependencies | none (`fetch`) |

## Public API

Entry [`index.ts`](../index.ts) exports:

- `HiggsFieldClient`
- `HiggsFieldError`
- Selected configuration and type exports (see entry file)

## Architecture

### Client composition

`HiggsFieldClient` ([`src/client/index.ts`](../src/client/index.ts)) constructs a single `HttpClient` and attaches fourteen services:

`user`, `workspace`, `subscription`, `asset`, `job`, `folder`, `community`, `notification`, `cms`, `clerk`, `score`, `misc`, `generation`.

### HTTP routing

`HttpClient` ([`src/client/http.ts`](../src/client/http.ts)) resolves host keys to fixed bases:

| Key | Base URL |
| --- | --- |
| `fnf` | `https://fnf.higgsfield.ai` |
| `community` | `https://community.higgsfield.ai` |
| `notification` | `https://notification.higgsfield.ai` |
| `cms` | `https://cms.higgsfield.ai` |
| `clerk` | `https://clerk.higgsfield.ai` |
| `fnfScore` | `https://fnf-score.higgsfield.ai` |

Behavior: URL construction from path and query params, request timeout via `AbortController`, JSON response parsing where `Content-Type` indicates JSON, passthrough for `text/event-stream` responses.

### Authentication

Configuration ([`src/types/index.ts`](../src/types/index.ts)) requires either:

1. **`token`**: JWT sent as `Authorization: Bearer`. Expiry read from JWT payload; no automatic refresh.
2. **`clerk`**: `sessionId` + `clientToken`. Short-lived JWT obtained via POST to Clerk session tokens endpoint; refreshed when expired or on `401` retry path.

Optional `datadome` config sends a `Cookie` header for experiments against bot protection.

### Errors

Non-success HTTP responses throw `HiggsFieldError` with `status`, `statusText`, and parsed `body` (JSON or text).

### Generation and jobs

`GenerationService` ([`src/client/services/generation.ts`](../src/client/services/generation.ts)):

- `POST /jobs/{job-set-type}` (hyphenated route segment)
- `GET /jobs/{jobId}/status`
- `GET /jobs/{jobId}`
- `waitForCompletion`: polling loop with configurable interval and max attempts

`JobSetType` ([`src/client/services/job.ts`](../src/client/services/job.ts)) is a string union of known job-set identifiers aligned to product usage.

## Provenance

Endpoints and cookie-based auth flows were inferred from the live web product (multi-host layout, Clerk API version `2025-11-10` in refresh URL). No vendor-published OpenAPI contract ships with this repo.

## Constraints

| Constraint | Detail |
| --- | --- |
| Read traffic | `GET` and analogous read calls typically succeed from Node when credentials are valid. |
| Generation `POST` | Often returns `403` outside a browser context due to DataDome / Cloudflare; README documents mitigation approaches (browser automation, etc.). |
| Stability | HiggsField may change routes and payloads without notice; consumers should pin versions and retest after upgrades. |

## Repository state

| Item | State |
| --- | --- |
| Scope | Library sources, examples, docs; no application shell |
| Automated tests | Not present; validation via `tsc`, Biome, manual runs |
| Examples | [`examples/usage.ts`](../examples/usage.ts), [`examples/generate.ts`](../examples/generate.ts) |
| Toolchain | TypeScript 5.x, Biome, pnpm |
