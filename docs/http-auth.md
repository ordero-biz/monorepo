# HTTP and Auth Architecture

`apps/platform` uses a BFF-style HTTP architecture for authenticated REST
requests. The browser never reads the JWT directly. Next.js route handlers own
the token cookie and forward authenticated requests to the backend with a Bearer
header. Server-rendered auth pages reuse the same backend validation rules
through a shared session helper instead of relying on middleware redirects.

## Boundaries

```mermaid
flowchart LR
  browser["Browser UI"]
  authPage["Server auth pages<br/>/sign-in and /sign-up"]
  clientApi["Client API helpers<br/>src/lib/api/client.ts"]
  query["TanStack Query<br/>Providers + auth queries"]
  nextApi["Next.js route handlers<br/>/api/auth/* and /api/backend/*"]
  cookie["HttpOnly cookie<br/>ordero_access_token"]
  session["Shared session helper<br/>src/lib/api/session.ts"]
  serverApi["Server REST client<br/>src/lib/api/server.ts"]
  backend["REST backend<br/>BACKEND_API_URL"]

  authPage --> session
  browser --> clientApi
  browser --> query
  query --> clientApi
  clientApi --> nextApi
  nextApi --> cookie
  nextApi --> session
  session --> serverApi
  nextApi --> serverApi
  serverApi --> backend
```

Key rules:

- Client components call same-origin `/api/*` routes.
- The JWT is stored in the `ordero_access_token` HttpOnly cookie.
- Server route handlers read the cookie and attach `Authorization: Bearer ...`.
- Server auth pages use the shared `getServerSession()` helper before render.
- Cached reads use TanStack Query. Auth actions and mutations use direct
  uncached calls.

## Core Schemas

Public auth and error shapes live in `src/lib/api/types.ts`.

```ts
type AuthUser = {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

type AuthSession =
  | {
      authenticated: true;
      user?: AuthUser;
    }
  | {
      authenticated: false;
    };

type ApiError = {
  status: number;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
};
```

Server-side session resolution uses a separate internal result shape:

```ts
type ServerSessionResult =
  | {
      ok: true;
      session: AuthSession;
      shouldClearAuthCookie: boolean;
    }
  | {
      ok: false;
      error: ApiError;
      shouldClearAuthCookie: false;
    };
```

## Sign-In Flow

The sign-in form submits credentials through the client API. The backend returns
a token, but the browser only receives safe session data.

```mermaid
sequenceDiagram
  participant User
  participant Form as SignInForm
  participant Client as signIn()
  participant Route as POST /api/auth/sign-in
  participant Backend as POST /api/v1/platform/owners/login
  participant Cookie as HttpOnly cookie
  participant Query as Session query cache

  User->>Form: Submit email and password
  Form->>Client: signIn(credentials)
  Client->>Route: POST /api/auth/sign-in
  Route->>Backend: POST /api/v1/platform/owners/login
  Backend-->>Route: token + optional user
  Route->>Cookie: Set ordero_access_token
  Route-->>Client: AuthSession without token
  Client-->>Form: ApiResult<AuthSession>
  Form->>Query: setQueryData(authQueryKeys.session)
  Form-->>User: Keep email and clear password
```

Failure behavior:

- invalid JSON returns `400`
- backend errors are normalized as `ApiError`
- backend `fieldErrors` are mapped back into TanStack Form
- backend form-level errors are shown through the shared toast surface
- a missing `token` from the backend returns `502`

## Logout Flow

Logout clears the local auth cookie even if the backend logout endpoint is
unavailable or returns an error.

```mermaid
sequenceDiagram
  participant UI as Client UI
  participant Client as logout()
  participant Route as POST /api/auth/logout
  participant Cookie as HttpOnly cookie
  participant Backend as POST /auth/logout

  UI->>Client: logout()
  Client->>Route: POST /api/auth/logout
  Route->>Cookie: Read ordero_access_token
  alt token exists
    Route->>Backend: POST /auth/logout with Bearer token
  end
  Route->>Cookie: Clear ordero_access_token
  Route-->>Client: { authenticated: false }
  Client-->>UI: signed-out session state
```

## Session Read and Cache Flow

Session state is the first cached read. The query calls the same-origin session
route, which delegates token validation to the shared `getServerSession()`
helper.

```mermaid
sequenceDiagram
  participant UI as Client UI
  participant Query as useSessionQuery()
  participant Client as getSession()
  participant Route as GET /api/auth/session
  participant Cookie as HttpOnly cookie
  participant Session as getServerSession()
  participant Backend as GET /me

  UI->>Query: Read session
  Query->>Client: getSession()
  Client->>Route: GET /api/auth/session
  Route->>Cookie: Read ordero_access_token
  Route->>Session: getServerSession(token)
  alt no token
    Session-->>Route: signed-out session
    Route-->>Client: { authenticated: false }
  else token exists
    Session->>Backend: GET /me with Bearer token
    alt backend accepts token
      Backend-->>Session: AuthUser
      Session-->>Route: authenticated session
      Route-->>Client: { authenticated: true, user }
    else backend returns 401
      Session-->>Route: signed-out session + clear cookie
      Route->>Cookie: Clear ordero_access_token
      Route-->>Client: { authenticated: false }
    else backend returns other error
      Session-->>Route: ApiError
      Route-->>Client: ApiError with backend status
    end
  end
  Client-->>Query: AuthSession or ApiError
  Query-->>UI: cached session result
```

Caching rules:

- default query `staleTime` is `60_000`
- query retries are disabled by default
- the session key is `authQueryKeys.session`
- login seeds the session cache after success

## Authenticated Backend Request Flow

Feature code should call `/api/backend/*` when it needs authenticated REST data
from the backend.

```mermaid
sequenceDiagram
  participant UI as Client UI
  participant Client as apiFetch()
  participant Proxy as /api/backend/[...path]
  participant Cookie as HttpOnly cookie
  participant Server as backendFetch()
  participant Backend as REST backend

  UI->>Client: apiFetch('/api/backend/orders')
  Client->>Proxy: Same-origin request
  Proxy->>Cookie: Read ordero_access_token
  alt no token
    Proxy-->>Client: 401 Authentication required
  else token exists
    Proxy->>Server: backendFetch(path, method, body, search, token)
    Server->>Backend: Forward request with Bearer token
    Backend-->>Server: REST response
    alt backend returns success
      Server-->>Proxy: raw Response
      Proxy-->>Client: original status, headers, and body
    else backend returns 401
      Server-->>Proxy: ApiError 401
      Proxy->>Cookie: Clear ordero_access_token
      Proxy-->>Client: ApiError 401
    else backend returns other error
      Server-->>Proxy: normalized ApiError
      Proxy-->>Client: normalized ApiError
    end
  end
```

Forwarding rules:

- supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`
- preserves successful backend response status codes and headers
- preserves query string search params
- forwards only selected headers: `accept` and `content-type`
- forwards bodies for non-`GET` and non-`HEAD` methods
- never forwards browser-readable JWT state because the browser cannot read the
  HttpOnly cookie

## Auth Page Guard Flow

Auth-page redirects now happen in the server page layer, not in `proxy.ts`.
`/sign-in` and `/sign-up` call `hasAuthenticatedServerSession()`, which reads
the cookie through `next/headers` and reuses `getServerSession()`.

```mermaid
sequenceDiagram
  participant Browser
  participant Page as /sign-in or /sign-up page
  participant Cookie as next/headers cookies()
  participant Session as getServerSession()
  participant Backend as GET /me

  Browser->>Page: Request auth page
  Page->>Cookie: Read ordero_access_token
  Page->>Session: getServerSession(token)
  alt valid token
    Session->>Backend: GET /me with Bearer token
    Backend-->>Session: AuthUser
    Session-->>Page: authenticated session
    Page-->>Browser: redirect('/')
  else no token or backend 401
    Session-->>Page: signed-out session
    Page-->>Browser: render auth page
  else backend error
    Session-->>Page: ApiError
    Page-->>Browser: render auth page
  end
```

Current guard behavior:

- authenticated users are redirected away from `/sign-in` and `/sign-up`
- stale cookies do not block access to auth pages
- backend outages do not block auth-page rendering
- protected application routes are intentionally not guarded yet

## Error Shape

Route handlers and client helpers normalize backend failures into `ApiError`.

```mermaid
flowchart LR
  backendError["Backend error response"]
  normalize["getApiErrorFromResponse()<br/>or client getApiError()"]
  apiError["ApiError<br/>status, message, code?, fieldErrors?"]
  form["TanStack Form errors"]
  client["Client caller"]

  backendError --> normalize
  normalize --> apiError
  apiError --> form
  apiError --> client
```

`fieldErrors` are optional and currently shaped as `Record<string, string>`.
When present, sign-in and sign-up map them into TanStack Form submit errors.

## Review Checklist

- Start with `src/lib/api/types.ts` to confirm the public shapes.
- Review `src/lib/api/session.ts` for shared session resolution and cookie-clear
  decisions.
- Review `src/lib/api/server.ts` for backend URL handling, Bearer header logic,
  cookie helpers, error normalization, and raw-response forwarding.
- Review `/api/auth/*` route handlers for cookie ownership and safe session
  responses.
- Review `src/lib/api/authPageGuard.ts` and the auth pages for redirect
  decisions before render.
- Review `/api/backend/[...path]` for request forwarding and 401 cleanup.
- Review `SignInForm.tsx` for the first feature integration.
