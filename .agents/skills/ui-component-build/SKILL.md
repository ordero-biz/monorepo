---
name: ui-component-build
description: Use when adding or refactoring shared UI components in packages/ui with shadcn-style APIs, Base UI primitives, Tailwind styling, explicit props, Storybook stories, and behavior-focused tests. Applies especially to components implemented from Figma or design-system specs.
---

# UI Component Build

Use this skill when working on shared components in `packages/ui`.

## Scope

This skill is for components that should:

- live in `packages/ui/src/components/[ComponentName]`
- be exported from `packages/ui/src/index.ts`
- use the repo's Tailwind + CSS variable token system
- follow shadcn-style component patterns
- use Base UI primitives/components whenever a matching primitive/component exists

Always also apply:

- `coding-conventions`
- `ui-routine-conventions`

## Build Rules

- Prefer a shadcn-style wrapper component with `cva` variants for styling.
- Prefer Base UI primitives/components by default when a matching primitive/component exists.
- For this repo, consistency is preferred over case-by-case minimalism.
- Fall back to native elements only when Base UI does not provide a suitable primitive/component.
- Keep the public API explicit. Do not default to broad `...props` passthrough for design-system components.
- Do not expose `className` on shared `packages/ui` components. Consumers should not style library components by passing ad hoc classes.
- Put exported prop types in local `types.ts`.
- Use single quotes in new TS/TSX code, except JSX attributes which should stay double-quoted.

## File Structure

For each shared component, create or preserve:

- `packages/ui/src/components/[ComponentName]/[ComponentName].tsx`
- `packages/ui/src/components/[ComponentName]/types.ts`
- `packages/ui/src/components/[ComponentName]/index.ts`
- `packages/ui/src/components/[ComponentName]/[ComponentName].test.tsx`
- `packages/ui/stories/[ComponentName].stories.tsx`

Then export it from:

- `packages/ui/src/index.ts`

## Styling Rules

Always read:

- `docs/ui-tokens.md`

Follow this token architecture:

- Raw Figma tokens stay in the `--figma-*` layer.
- Semantic app tokens are the preferred layer for component usage.
- Tailwind utilities should be used for shared semantic tokens.
- Component-only tokens may stay as CSS variable references when promoting them to Tailwind utilities would be noisy or premature.
- Do not use raw `--figma-*` tokens in component code.
- Do not invent new semantic or bridged tokens until you have reviewed the existing token system through `packages/ui/src/styles/globals.css`, then the imported token files under `packages/ui/src/styles`.

Do not add ad hoc component-specific semantic globals to `globals.css` unless there is a strong architectural reason.

When implementing from Figma:

- Prefer existing imported tokens first.
- Review `packages/ui/src/styles/globals.css` as the entry point, then the imported token files under `packages/ui/src/styles`, before deciding a token is missing.
- Only add new token mappings when the value is genuinely missing from the current token layers.
- Preserve the project structure described in `docs/ui-tokens.md`.

## Storybook Rules

Stories should document the public component API rather than implementation details.

Minimum expectations:

- a default story
- stories that reflect meaningful variant groups from the design system
- icon / disabled / size examples where they matter for consumers

When the design system presents variants separately, prefer separate stories rather than one giant demo.

## Testing Rules

Tests should cover user-observable behavior only.

Do:

- query by role and accessible name
- use `@testing-library/user-event` for interactions
- use `prepareSetup` from `@ordero/test-config/react` for repeated component defaults in a test file
- test behavior such as click handling, disabled behavior, submit behavior, accessible naming, and other real outcomes

Do not:

- assert internal class names or token names
- test `cva` output directly
- test implementation details that a refactor could change without changing behavior

Vitest globals are enabled in `packages/ui`, so do not import `describe`, `it`, `expect`, `vi`, or lifecycle helpers in each test file.

For the canonical shared setup example, see `../ui-routine-conventions/references/prepare-setup-example.md`.

## Validation

Run these when possible:

- `pnpm --dir packages/ui format`
- `pnpm --dir packages/ui typecheck`
- `pnpm --dir packages/ui test src/components/[ComponentName]/[ComponentName].test.tsx`

If the component changed Storybook stories only, still run `format` and `typecheck`.
