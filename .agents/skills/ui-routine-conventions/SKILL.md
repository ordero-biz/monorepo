---
name: ui-routine-conventions
description: Use for all component work in this repo across packages and apps, and for day-to-day UI decisions about testing style, CSS variable usage, Tailwind token exposure, and shared component conventions.
---

# UI Routine Conventions

Use this skill for all component work in this repo across `packages` and `apps`.

It should also be used for general UI work when making decisions about:

- testing style
- CSS variable usage
- Tailwind token exposure
- shared component conventions

## Read First

When the task touches tokens or CSS variable architecture, read:

- `docs/ui-tokens.md`

## Testing Conventions

Prefer behavior-first tests.

Good tests:

- verify accessible roles and names
- verify meaningful interactions
- verify user-visible outcomes
- verify form behavior, disabled behavior, focus behavior, and accessible labeling when relevant

Avoid:

- testing implementation details
- asserting class name presence unless there is no better observable signal
- asserting token names or `cva` internals

Preferred tooling:

- `@testing-library/react`
- `@testing-library/user-event`
- Vitest globals (`describe`, `it`, `expect`, `vi`, etc.) without per-file imports

## CSS Variable Conventions

- Keep raw imported Figma values in the `--figma-*` layer.
- Prefer semantic tokens over raw Figma tokens in component code.
- Do not introduce one-off semantic globals casually.
- Before adding new variables, check whether the existing token files already cover the needed value.

## Tailwind Utility Exposure Rule

Expose a token through `@theme inline` only when:

- it is shared across multiple components
- it clearly improves readability in component code

Keep a token as a direct CSS variable when:

- it is highly component-specific
- the generated utility name would be awkward
- reuse is not established yet

Do not promote every component token into Tailwind utilities up front. Revisit promotion when more components reveal real reuse patterns.

## Shared UI Conventions

For shared UI work across `packages` and `apps`:

- prefer Base UI primitives/components whenever a matching primitive/component exists
- prefer explicit component props for design-system components
- do not expose `className` on shared `packages/ui` components
- keep stories and tests aligned with the public API, not internal structure
- preserve consistency with existing components unless there is a deliberate architectural improvement

For `packages/ui` specifically:

- prefer stable exports from `packages/ui/src/index.ts`

## Validation

Run the smallest useful package-level checks for the files you touched.

For `packages/ui`, prefer:

- `pnpm --dir packages/ui format`
- `pnpm --dir packages/ui typecheck`
- targeted `pnpm --dir packages/ui test ...`
