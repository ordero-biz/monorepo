---
name: platform-http-requests
description: Use when adding or changing HTTP request/response integrations in apps/platform, apps/store, or shared HTTP packages, including REST API helpers, Next.js route handlers, auth/session calls, backend proxy calls, TanStack Query useQuery hooks, mutations, cache invalidation, or tests for these flows.
---

# Platform HTTP Requests

Use this skill for HTTP and server-state work in `apps/platform`, `apps/store`,
and shared HTTP packages.

Also apply:

- `ts-react-conventions` for touched TypeScript and React files
- `ui-routine-conventions` when the request changes UI behavior or tests

## Read First

Before changing the HTTP/auth architecture, read:

- `docs/packages.md`
- `docs/http-auth.md`

Use the existing architecture unless the user explicitly asks for a redesign.

## Architecture Rules

- Browser code must not read, store, decode, or forward JWTs.
- JWTs live in the `ordero_access_token` HttpOnly cookie.
- Client components call same-origin `/api/*` routes.
- Next.js route handlers own cookie reads/writes and backend forwarding.
- Server-side backend requests attach `Authorization: Bearer <token>`.
- Use `BACKEND_API_URL` only from server-side code.
- Normalize backend failures into the shared `ApiError` shape.
- Use `ApiResult<T>` for client helper return values instead of throwing for ordinary HTTP failures.
- Keep shared HTTP/auth contracts in `@ordero/api-types`.
- Keep browser-safe request transport in `@ordero/api-client`.
- Keep Next.js server/BFF helpers in `@ordero/next-api`.
- Keep app-domain schemas, routes, form payloads, and feature request helpers app-owned unless multiple apps truly need them.
- Keep shared app-owned domain entity types outside feature folders when both
  features and request helpers need them, for example in
  `src/lib/domain/[resource].ts`; avoid making `src/lib` import from
  `src/features`.
- Keep request/response DTOs near the API helper when backend wire shapes
  differ from domain entities, and map DTOs to domain entities before returning
  them to feature code.
- Browser code must not import server-only packages such as `@ordero/next-api`.

## Adding A Client Request

For uncached calls:

- add or reuse a feature-facing request helper in `src/lib/client/api.ts`
- call `apiFetch<T>()` from `src/lib/client/fetch.ts`, which re-exports `@ordero/api-client`
- point it at a same-origin `/api/*` route
- return `ApiResult<T>`

For authenticated backend REST calls:

- call `/api/backend/[resource]` from the client
- let `app/api/backend/[...path]/route.ts` attach the Bearer token
- do not introduce direct browser calls to `BACKEND_API_URL`

## Adding A Cached Query Hook

Use TanStack Query only for server-state reads that should be cached.

Required shape:

- create a stable query key near the domain hook, using `as const`
- call a client API helper from the `queryFn`
- throw `result.error` only after receiving `{ ok: false }`
- keep auth-sensitive queries on `retry: false` unless there is a clear reason to opt in
- rely on the app provider defaults before adding per-query options

Do not use `useQuery` for writes, login, logout, or submit actions.

## Adding A Mutation Or Write

For writes:

- use a direct client helper or `useMutation`
- keep the underlying request uncached
- invalidate affected query keys after success
- after creating a new entity, invalidate the relevant list query key unless the
  new entity is deliberately seeded into every affected cached list
- seed query data when the mutation result is the new source of truth
- keep form backend errors mapped into TanStack Form submit errors when applicable

For auth:

- login should set or seed `authQueryKeys.session` when a session is returned
- logout should clear or invalidate session-dependent queries
- route handlers should clear the auth cookie on token rejection

## Adding Route Handlers

When adding `/api/auth/*` or `/api/backend/*` behavior:

- keep token access server-side
- use helpers from `src/lib/api/server.ts` when possible; it wraps `@ordero/next-api`
- use `fetchBackendData<T>()` for typed app-owned JSON/text responses
- use `fetchBackendResponse()` when proxying raw backend responses
- return safe JSON to the browser, never the JWT
- clear `ordero_access_token` on backend `401` when the token is no longer trusted
- preserve request method, body, and search params when forwarding backend proxy calls
- forward only intentional headers; `/api/backend/[...path]` forwards `origin`
  because the backend uses it for tenant/domain resolution

## Tests

Choose the smallest layer that proves the behavior:

- generic `apiFetch` transport/error behavior: `src/lib/client/fetch.test.ts`
  or `packages/api-client`, with mocked `fetch`
- feature-facing client request helpers: `src/lib/client/api.test.ts`, covering
  the stable same-origin path, method, body, and result shape through `apiFetch`
- shared server helpers: test package behavior in `packages/next-api` when the
  package behavior changes; keep app route-handler tests focused on app wiring
- query hooks, form hooks, and components that call app-owned request helpers: mock the nearest app-owned request helper rather than `fetch`
- route handlers: Vitest with `NextRequest` and mocked nearest app-owned server request helper; mock backend `fetch` only when the route handler itself calls backend `fetch` directly
- form integration: Testing Library component tests
- routed browser flows: Playwright

Mock the closest app-owned request boundary that the unit under test depends on.
Outside the client request-helper tests themselves, do not mock a lower
transport layer when production code already wraps that layer in an app-owned
helper.

For Playwright tests that mock an app-owned route with `page.route()` or
`context.route()`, register the route before the user action that triggers it.
When the request contract is part of the behavior under test, also wait for the
request and assert stable contract details such as method and JSON body. Keep
these assertions focused on the same app-owned boundary being mocked.

Required coverage for new request flows:

- success response shape
- normalized backend error shape
- field error mapping when forms are involved
- Bearer header forwarding for authenticated backend calls
- cache seeding or invalidation when cached state is affected, including list
  invalidation after create flows; verify this at the cache/helper integration
  layer rather than in library-agnostic form tests
- auth cookie clearing on backend `401` when relevant

## Validation

Run package checks when shared packages change:

```bash
pnpm --dir packages/api-types typecheck
pnpm --dir packages/api-client typecheck
pnpm --dir packages/next-api typecheck
```

For `apps/platform` or `apps/store`, run the smallest useful app set, usually:

```bash
pnpm --dir apps/[app] format
pnpm --dir apps/[app] typecheck
pnpm --dir apps/[app] test
```

Run E2E tests when route guards or routed browser flows change:

```bash
pnpm --dir apps/platform test:e2e
```
