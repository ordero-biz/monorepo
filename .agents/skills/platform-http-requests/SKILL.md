---
name: platform-http-requests
description: Use when adding or changing HTTP request/response integrations in apps/platform, including REST API helpers, Next.js route handlers, auth/session calls, backend proxy calls, TanStack Query useQuery hooks, mutations, cache invalidation, or tests for these flows.
---

# Platform HTTP Requests

Use this skill for HTTP and server-state work in `apps/platform`.

Also apply:

- `ts-react-conventions` for touched TypeScript and React files
- `ui-routine-conventions` when the request changes UI behavior or tests

## Read First

Before changing the HTTP/auth architecture, read:

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

## Adding A Client Request

For uncached calls:

- add or reuse a helper in `src/lib/api/client.ts`
- call `apiFetch<T>()`
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
- seed query data when the mutation result is the new source of truth
- keep form backend errors mapped into TanStack Form submit errors when applicable

For auth:

- login should set or seed `authQueryKeys.session` when a session is returned
- logout should clear or invalidate session-dependent queries
- route handlers should clear the auth cookie on token rejection

## Adding Route Handlers

When adding `/api/auth/*` or `/api/backend/*` behavior:

- keep token access server-side
- use helpers from `src/lib/api/server.ts` when possible
- return safe JSON to the browser, never the JWT
- clear `ordero_access_token` on backend `401` when the token is no longer trusted
- preserve request method, body, and search params when forwarding backend proxy calls
- forward only intentional headers

## Tests

Choose the smallest layer that proves the behavior:

- client helpers/hooks: Vitest with mocked `fetch`
- route handlers: Vitest with `NextRequest` and mocked backend `fetch`
- form integration: Testing Library component tests
- routed browser flows: Playwright

Required coverage for new request flows:

- success response shape
- normalized backend error shape
- field error mapping when forms are involved
- Bearer header forwarding for authenticated backend calls
- cache seeding or invalidation when cached state is affected, but verify that at the cache/helper integration layer rather than in library-agnostic form tests
- auth cookie clearing on backend `401` when relevant

## Validation

For `apps/platform`, run the smallest useful set, usually:

```bash
pnpm --dir apps/platform format
pnpm --dir apps/platform typecheck
pnpm --dir apps/platform test
```

Run E2E tests when route guards or routed browser flows change:

```bash
pnpm --dir apps/platform test:e2e
```
