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
