# Workspace Packages

The monorepo uses pnpm workspaces. Apps live under `apps/*`; shared packages
live under `packages/*`.

## Package Boundaries

### `@ordero/api-types`

Pure shared HTTP/auth contract types.

Use this package for:

- `Token`
- generic `AuthSession<TUser = unknown>`
- `ApiError`
- `ApiResult<T>`

Do not put app-domain schemas here. Types such as sign-in payloads, users,
stores, routes, or feature-specific backend resources stay app-owned unless
multiple apps need the same contract.

### `@ordero/api-client`

Browser-safe HTTP transport helpers.

Use this package for generic client request behavior such as `apiFetch<T>()`.
It must stay safe for Client Components and browser bundles:

- no `next/*` imports
- no cookie or JWT access
- no `BACKEND_API_URL`
- no direct backend calls

Apps should keep feature-facing helpers in `apps/*/src/lib/client/api.ts`.
Those helpers call same-origin `/api/*` routes through `apiFetch<T>()`.
Keep same-origin API path constants in `apps/*/src/lib/client/apiPaths.ts`.
Resource-specific helper modules under `src/lib/client/api/*` are acceptable
when a resource grows beyond the flat app helper.

### `@ordero/next-api`

Next.js server/BFF helpers for route handlers and server-rendered auth checks.

Use this package for:

- backend REST calls from server code
- backend error normalization
- auth cookie helpers
- token reads from `NextRequest`
- server-session resolution
- auth-page guard primitives

This package is server-only. Browser code and Client Components must not import
it. Apps keep their route handlers under `apps/*/src/app/api/*` and can expose
thin local wrappers from `apps/*/src/lib/api/*` when that preserves stable app
imports.
Keep backend endpoint constants in `apps/*/src/lib/api/backendPaths.ts` so route
handlers and session helpers do not repeat backend path strings.

### `@ordero/ui`

Shared presentational UI components and design-system styles. See
`docs/ui-components.md`, `docs/ui-tokens.md`, and the UI skills for the detailed
component workflow.

### `@ordero/test-config`

Shared Vitest configuration helpers.

## App-Owned Code

Keep these in the app that owns the behavior:

- app routes and navigation constants
- same-origin API path constants and backend endpoint constants
- feature-facing client API helpers
- form payloads and validation schemas
- app-specific user shapes
- domain resources such as stores
- Next.js route handler files

Extract into a package only when the same contract or behavior is needed across
apps and does not depend on app-specific routes, copy, forms, or domain models.

## Validation

For package-only changes, run the relevant package checks, for example:

```bash
pnpm --dir packages/api-types typecheck
pnpm --dir packages/api-client typecheck
pnpm --dir packages/next-api typecheck
```

For changes that affect app behavior through shared packages, also run the
affected app checks:

```bash
pnpm --dir apps/platform typecheck
pnpm --dir apps/platform test
pnpm --dir apps/store typecheck
pnpm --dir apps/store test
```
