# Accessibility Testing Reference

Use this reference with `ui-routine-conventions` and `ui-component-build` when working on shared UI in `packages/ui`.

## Test Layer Split

- `pnpm --dir packages/ui test`
  - unit Vitest project
  - use for semantic behavior and explicit interactions
- `pnpm --dir packages/ui test:storybook`
  - Storybook Vitest project
  - use for story-based browser checks and automated accessibility checks

Use Playwright for app-level integration flows rather than as the default shared-component layer.

## Shared Component Expectations

Interactive shared components should usually have:

- a default story
- disabled state coverage when relevant
- invalid and helper-text coverage when relevant
- size or variant coverage when it changes behavior, accessibility, or contrast

## Boundary Rule

Do not move field-level helper-text expectations into low-level primitives if the wrapper component owns that API.

Examples in this repo:

- `Input` owns primitive input behavior and ARIA wiring
- `TextField` owns label, helper text, and error text presentation
- `PasswordField` composes `TextField`, so field-level helper and error behavior belongs there

For primitive-only components, accessibility description coverage should be exercised through `aria-describedby` rather than by inventing field UI that the primitive does not own.
