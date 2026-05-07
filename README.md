# HiggsField API Client

A TypeScript API client for [HiggsField.ai](https://higgsfield.ai).

Unofficial SDK for scripts and integrations against HiggsField’s multi-service APIs (Clerk auth, multi-host routing, generation/job helpers). See [`docs/repository-assessment.md`](docs/repository-assessment.md) for a concise technical overview.

## Install

From npm (if published):

```bash
npm install higgsfield-api-client
# or
pnpm add higgsfield-api-client
# or
yarn add higgsfield-api-client
```

From this GitHub repo:

```bash
pnpm add github:anthonyjohn17/higgsfield-api-client
# or
npm install github:anthonyjohn17/higgsfield-api-client
```

## Quick Start

```ts
import { HiggsFieldClient } from "higgsfield-api-client";

const client = new HiggsFieldClient({
  clerk: {
    sessionId: process.env.CLERK_SESSION_ID!,
    clientToken: process.env.CLERK_CLIENT_TOKEN!,
  },
});

const user = await client.user.getMe();
console.log(user);
```

## Auth

The client supports two auth modes:

### Clerk auto-refresh (recommended)

Provides long-lived credentials that automatically mint fresh ~60s JWTs via the Clerk API.

```bash
export CLERK_SESSION_ID="sess_xxxxx"
export CLERK_CLIENT_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

```ts
import { HiggsFieldClient } from "higgsfield-api-client";

const client = new HiggsFieldClient({
  clerk: { sessionId: "sess_xxxxx", clientToken: "eyJ..." },
});
```

**Getting credentials:**
1. Log in at https://higgsfield.ai in a browser
2. Open DevTools > Application > Cookies
3. Copy `clerk_active_context` (session ID) `sess_xxx`)
4. Copy `__client` cookie value (long-lived client token)

5. Copy `__session` cookie value (short-lived JWT)

```ts
const client = new HiggsFieldClient({ token: "eyJ..." });
```

### Env vars

| Variable | Description |
|---|---|
|---|---|
| `CLERK_SESSION_ID` | Clerk session ID (`sess_xxx`) |
| `CLERK_CLIENT_TOKEN` | Clerk long-lived client token |
| `HIGGSFIELD_TOKEN` | Static Clerk JWT (short-lived, ~60s) |

## Service Modules

| Module | Service |
|---|---|
|---|---|
| `client.user` | User profile, settings, credits, |
| `client.workspace` | Workspaces, folders, settings |
| `client.subscription` | Subscription plans, changes |
| `client.asset` | Generated assets |
| `client.job` | Job listing by type |
| `client.folder` | Folders |
| `client.community` | Community ( publications, comments, profiles |
| `client.notification` | Notifications (SSE stream, list) |
| `client.cms` | CMS notices, camera settings |
| `client.clerk` | Auth (environment, client, session tokens) |
| `client.score` | Karma/tasks |
| `client.generation` | Image/video generation + polling |
| `client.misc` | Tours, presets, references, etc |

## Discovered API Domains

| Domain | Base URL |
|---|---|
| `fnf` | `https://fnf.higgsfield.ai` | Core API |
| `community` | `https://community.higgsfield.ai` | Community |
| `notification` | `https://notification.higgsfield.ai` | Notifications |
| `cms` | `https://cms.higgsfield.ai` | CMS |
| `clerk` | `https://clerk.higgsfield.ai` | Auth (Clerk) |
| `fnfScore` | `https://fnf-score.higgsfield.ai` | Score/Karma |

## Development

```bash
pnpm install          # Install dependencies
pnpm run build        # Build dist (tsup)
pnpm run typecheck    # TypeScript type checking
pnpm run lint         # Lint (Biome)
pnpm run lint:fix     # Auto-fix lint issues
pnpm run format       # Format code
pnpm run example      # Run usage example
```

## Publishing

```bash
pnpm run build
npm publish --access public
```

The `prepublishOnly` script runs typecheck, lint, and build automatically.

## Examples

See `examples/usage.ts` and `examples/generate.ts`.

## Known Limitations

### Bot Detection on Write Endpoints

The `POST /jobs/{job-set-type}` endpoint (used for image/video generation) is protected by **DataDome** bot detection backed by Cloudflare. This means:

- **All `GET`/read endpoints work perfectly** from the CLI client (user, assets, jobs, workspaces, subscriptions, community, etc.).
- **`POST /jobs/*` returns `403 Forbidden`** when called outside a real browser context.
- The DataDome cookie is tied to the browser fingerprint (User-Agent, TLS signature, IP) and cannot be reused from a server-side HTTP client like Node's `fetch`.

The generation service (`client.generation`) is fully implemented with `generate()`, `getJobStatus()`, `getJob()`, and `waitForCompletion()` methods. However, calling `generate()` from CLI requires one of:

1. **Proxy through a headless browser** (Playwright/Puppeteer) to execute the POST in a real browser context.
2. **Use a browser automation tool** to handle the DataDome challenge and forward the request.
3. **Reverse-engineer the DataDome challenge** (not recommended, fragile and likely violates ToS).

The discovered generation flow:

1. `POST /jobs/{job-set-type}` — Create a generation job (DataDome protected)
2. `GET /jobs/{jobId}/status` — Poll until complete
3. `GET /jobs/{jobId}` — Retrieve completed result with asset URLs
4. `GET /jobs/accessible?job_set_type` — List all jobs by type

## License

[MIT](LICENSE) © [John Anthony](https://github.com/anthonyjohn17).
