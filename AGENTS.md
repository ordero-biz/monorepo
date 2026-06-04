# Agent Instructions

## Quote Style for New Code

- When creating new files or adding new code, use single quotes wherever possible.
- Exception: keep double quotes for attributes in React components (e.g., `title="value"`).
- Do not mass‑edit existing files just to change the quote style unless explicitly requested.

## Design Tokens

- Treat Figma variables as the raw source of truth and keep them in a dedicated `--figma-*` token layer.
- Map raw Figma tokens into semantic app tokens before using them in components.
- Prefer styling shadcn and Base UI components with semantic tokens like `--primary`, `--border`, `--background`, and `--radius`, not raw `--figma-*` tokens, unless a raw token is specifically needed.
- Expose semantic tokens to Tailwind through `@theme inline` so utilities stay aligned with the design system.

## Shared Packages

- Keep shared HTTP/auth contracts in `@ordero/api-types`.
- Keep browser-safe request transport in `@ordero/api-client`.
- Keep Next.js server/BFF helpers in `@ordero/next-api`.
- Keep app-domain schemas, app routes, and feature request helpers app-owned unless multiple apps truly need them.
- Browser code must not import server-only packages such as `@ordero/next-api`.
