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

- `ts-react-conventions`
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

The token-usage and Figma-mapping rules from `ui-routine-conventions` are mandatory for this skill and take precedence over any looser interpretation of this section.

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
- invalid and helper-text stories when the component owns those states

For accessibility-sensitive controls, stories should cover the meaningful states that Storybook accessibility checks are expected to validate.

Examples:

- default
- disabled
- invalid
- helper text or description
- icon/adornment states when they affect accessibility or contrast

When the design system presents variants separately, prefer separate stories rather than one giant demo.

For story typing in `packages/ui`:

- keep `type Story = StoryObj<typeof meta>` instead of switching story aliases to the component type
- type story constants that mirror component unions from the exported component types, for example `ButtonColor`, `ButtonSize`, or `RadioColor`
- prefer `satisfies readonly SomeUnionType[]` for story option arrays so values are checked against the public union while preserving literal inference
- type story helper objects from exported component prop types such as `InputProps`, `SelectProps`, or `TextFieldProps` instead of reconstructing ad hoc local shapes

For the repo-specific accessibility testing workflow, read:

- `docs/accessibility-testing.md`
- `../ui-routine-conventions/references/accessibility-testing.md`

## Testing Rules

Follow the testing conventions in `ui-routine-conventions`; this section only adds package-specific boundaries for `packages/ui`.

For shared `packages/ui` components:

- keep assertions at the correct component boundary
- cover the public API documented by the component stories
- use Storybook Vitest for browser-backed story and accessibility coverage when story states or accessibility behavior changed

Examples of correct boundary choices:

- `Input` should be tested for primitive ARIA support such as `aria-describedby`
- `TextField` should be tested for label, helper text, and error text behavior
- `PasswordField` should be tested as a field wrapper, not as if it directly owned low-level input internals

Do not:

- test low-level primitive behavior from a wrapper component that does not own that behavior
- duplicate coverage already owned by a lower-level shared component unless the wrapper changes the user-visible contract

For the canonical shared setup example, see `../ui-routine-conventions/references/prepare-setup-example.md`.

## Validation

Run these when possible:

- `pnpm --dir packages/ui format`
- `pnpm --dir packages/ui typecheck`
- `pnpm --dir packages/ui test src/components/[ComponentName]/[ComponentName].test.tsx`
- `pnpm --dir packages/ui test:storybook` when story states or shared UI accessibility behavior changed

If the component changed Storybook stories only, still run `format` and `typecheck`.
