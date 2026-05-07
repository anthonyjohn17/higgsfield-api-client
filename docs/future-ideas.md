# Future work

Optional enhancements for `higgsfield-api-client`. This document is informational only; items are not scheduled or guaranteed.

---

## 1. Testing

**Current state:** Typecheck, lint, manual example runs.

| Item | Specification |
| --- | --- |
| Mocked HTTP tests | Mock `fetch` (e.g. undici `MockAgent` or equivalent). Cover token refresh, header assembly, timeouts, `HiggsFieldError` mapping. No production traffic in default test run. |
| Fixture snapshots | Store small JSON fixtures per endpoint family; update intentionally when upstream shapes change. |
| Integration profile | Separate script or Vitest project gated on env vars (`CLERK_SESSION_ID`, etc.). Disabled in default CI. |
| Job-set drift check | Script comparing `JobSetType` union to an external manifest or captured list; reports additions/removals. |

---

## 2. Errors, retries, cancellation

**Current state:** `HiggsFieldError` carries status and body.

| Item | Specification |
| --- | --- |
| Retry policy | Opt-in middleware: exponential backoff for idempotent `GET` and designated polling calls; `POST` to generation excluded unless explicitly enabled. |
| Rate limiting | On `429`, parse `Retry-After` when present; optional `RateLimitedError` with `retryAfterMs`. |
| Hooks | Optional `onRequest` / `onResponse` on config for logging or tracing without adding core dependencies. |
| AbortSignal | Public async methods accept optional `signal` where long-running (e.g. `waitForCompletion`). |

---

## 3. Generation and bot protection

**Constraint:** `POST /jobs/*` is bot-protected; plain Node `fetch` frequently receives `403`.

| Item | Specification |
| --- | --- |
| Optional bridge package | Separate package with Playwright/Puppeteer dependency; executes generation in a real browser session; core package stays dependency-free. |
| Auth setup helper | CLI or documented steps: validate env, print masked credential status, link to cookie extraction steps. |
| Read-side orchestration | Helpers: download asset URL to file, streaming download, batch sync of recent jobs (jobs created in UI). |
| Error taxonomy | Subclasses or stable codes for `403` (bot), `401` (auth), timeout vs network failure. |

**Out of scope:** TLS or fingerprint spoofing aimed at bypassing DataDome.

---

## 4. CLI

Thin wrapper around `HiggsFieldClient`.

**Example commands:**

- `user me`
- `assets list --workspace <id> --limit <n>`
- `jobs list --type <JobSetType>`
- `notify tail` (SSE consumer where viable)
- `config doctor` (env validation, token expiry hint)

**Packaging:** `bin` in this package or a scoped `@anthonyjohn17/higgsfield-cli` package.

---

## 5. MCP server

Read-only tools mapped to safe client methods (`user.getMe`, job listing, asset listing, etc.). Auth from env vars; fail fast with explicit errors if credentials missing. Generation tools omitted unless combined with a compliant browser path.

---

## 6. Documentation

| Item | Specification |
| --- | --- |
| Architecture diagram | Mermaid: hosts, Clerk refresh sequence, service boundaries. |
| Recipes | Short copy-paste flows (backup assets, export lists, notification forwarding patterns). |
| Changelog | `CHANGELOG.md` (Keep a Changelog format) once releases become frequent. |
| Security | `SECURITY.md`: credential handling, unofficial-client disclaimer. |
| Contributing | Steps to add an endpoint: service module, host key, naming conventions. |

---

## 7. Types

| Item | Specification |
| --- | --- |
| Branded IDs | Types such as `WorkspaceId`, `JobId` for opaque strings. |
| Job status unions | Discriminated unions if upstream returns a closed set of states. |
| Optional runtime validation | Peer dependency on `zod` or `valibot` in an optional package or subpath for critical responses. |

---

## 8. Packaging and runtimes

| Item | Specification |
| --- | --- |
| Export subpaths | Only if tree-shaking and documentation remain clear. |
| Deno / Bun | Smoke import tests on current ESM entry; document limitations. |
| Browser / workers | Document unsupported environments or required polyfills if Node-only APIs appear. |

---

## 9. Observability

| Item | Specification |
| --- | --- |
| Debug mode | Optional flag; log method, URL pattern, status; never log raw tokens. |
| Request correlation | Optional client-generated request id header for multi-request traces. |

---

## 10. Governance (unofficial SDK)

| Item | Specification |
| --- | --- |
| Disclaimer | README states vendor may change APIs without notice; pin dependency versions. |
| Issue templates | Bug report (redacted responses); upstream breakage reports. |
| Compatibility matrix | Table of library version vs last manual verification date (informal is acceptable). |

---

## 11. CI/CD

| Item | Specification |
| --- | --- |
| Pull request checks | `typecheck`, `lint`, `build`, `test` when tests exist. |
| Releases | Documented tagging or semantic-release workflow for npm. |
| Provenance | `npm publish --provenance` when publishing from GitHub Actions. |

---

## 12. Example downstream projects

Out-of-tree or under `examples/` as references only:

- Dashboard for credits / jobs / assets (read-only API).
- Scheduled digest (email or webhook) from community or notification data.
- Local media indexer using asset metadata.

---

## 13. Suggested implementation order

1. Tests and CI.
2. Retry hooks, rate-limit handling, `AbortSignal` on long polls.
3. Read-only CLI.
4. Recipes, changelog, contributing guide.
5. Optional browser bridge package for generation.
6. MCP server (read-only MVP).
