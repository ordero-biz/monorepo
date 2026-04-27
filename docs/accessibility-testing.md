# Accessibility Testing

## Purpose

This repo uses a layered accessibility testing approach for shared UI work in `packages/ui`.

Each layer answers a different question:

- unit Vitest tests verify semantic behavior and interaction details
- Storybook Vitest tests verify story states in a real browser and run automated accessibility checks
- Playwright should be reserved for app-level flows where composition across multiple components matters

## Commands

From the repo root:

```bash
pnpm --dir packages/ui test
```

Runs the `unit` Vitest project for component test files under `packages/ui/src`.

```bash
pnpm --dir packages/ui test:storybook
```

Runs the `storybook` Vitest project for Storybook stories in Chromium, including Storybook accessibility checks.

```bash
pnpm --dir packages/ui storybook
```

Starts the local Storybook server so stories, test results, and accessibility findings can be inspected in the UI.

## What Each Layer Should Cover

### Unit tests

Use unit tests for behavior that should be asserted explicitly:

- accessible roles and names
- keyboard interaction
- focus and blur behavior
- submit behavior
- disabled behavior
- controlled and uncontrolled behavior
- semantic descriptions when the component owns them

Examples in this repo:

- `Button` tests assert accessible names and submit behavior
- `Select` tests assert accessible descriptions and keyboard behavior
- `CheckboxGroup` tests assert grouped selection behavior

### Storybook accessibility checks

Use Storybook tests to validate meaningful component states in a browser:

- default
- disabled
- invalid
- helper text
- icon/adornment states
- size and variant states when they affect semantics or contrast

Storybook accessibility checks are enforced for the main first-wave shared controls:

- `Button`
- `Checkbox`
- `CheckboxGroup`
- `IconButton`
- `Input`
- `PasswordField`
- `Select`
- `TextField`

`Typography` is intentionally excluded from enforced Storybook accessibility checks. Its stories are primarily visual documentation and color samples, so automated Storybook a11y checks add less signal there than they do for interactive controls. Typography semantics should still be covered in component tests where relevant.

### Playwright

Use Playwright for integrated app flows, not as the default shared-component testing tool.

Good candidates:

- auth flows
- checkout flows
- modal and drawer flows
- multi-step forms
- page-level landmark and heading structure

## Storybook UI Inspection

To inspect accessibility results in Storybook:

1. Run `pnpm --dir packages/ui storybook`
2. Open a story in the Storybook UI
3. Open the bottom panel
4. Check the `Tests` panel for test status
5. Check the `Accessibility` panel for rule-level accessibility findings

## Component Boundary Rule

Do not force field-level expectations into low-level primitives when those expectations belong to wrapper components.

Examples:

- `Input` is a low-level input primitive. It should support `aria-label`, `aria-labelledby`, and `aria-describedby`, plus focus, invalid, disabled, and adornment behavior.
- `TextField` is the wrapper that owns label, helper text, and error text relationships.
- `PasswordField` is a wrapper around `TextField`, so helper text and error text belong there rather than in the base `Input`.

That means:

- `Input` stories should cover external description via `aria-describedby`
- `TextField` stories should cover helper text and error text rendering
- `PasswordField` stories should cover field-level helper and error behavior through its wrapper API

This keeps tests aligned with the public API and avoids teaching contributors the wrong abstraction boundary.
