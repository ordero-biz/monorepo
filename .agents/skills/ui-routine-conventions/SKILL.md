---
name: ui-routine-conventions
description: Use for UI component work in this repo and for day-to-day UI decisions about testing style, CSS variable usage, Tailwind token exposure, and shared component conventions.
---

# UI Routine Conventions

Use this skill for UI component work across `packages` and `apps`.

It should also be used for general UI work when making decisions about:

- testing style
- CSS variable usage
- Tailwind token exposure
- shared component conventions

For TS and TSX authoring rules that are not UI-specific, also use:

- `ts-react-conventions`

## Read First

When the task touches tokens or CSS variable architecture, read:

- `docs/ui-tokens.md`

When the task touches accessibility testing strategy for shared UI, also read:

- `docs/accessibility-testing.md`

## Testing Conventions

Use behavior-first tests.

Before adding or changing a test, name the behavior in user or public-API terms.
Then choose assertions that prove that behavior through observable output.
Changing `document.querySelector(...)` to a Testing Library query is not enough if
the assertion still checks internals.

Good tests:

- verify accessible roles and names
- verify meaningful interactions
- verify user-visible outcomes
- verify form behavior, disabled behavior, focus behavior, and accessible labeling when relevant

Avoid:

- testing implementation details
- asserting class name presence
- asserting token names or `cva` internals
- asserting `data-*` state flags, generated ids, DOM ancestry, portals, slots, or
  wrapper structure unless they are explicitly documented as public API
- using `document`, `querySelector`, `querySelectorAll`, or `closest` when the
  same element can be found by role, label, text, display value, placeholder, or
  another Testing Library query

If requested coverage cannot be achieved under these restrictions, pause before
writing an implementation-detail assertion. Explain the gap and suggest the
right layer instead, such as:

- a Storybook/browser test for layout, animation, hover-only visuals, CSS state,
  or a11y behavior that needs a browser
- a Playwright flow for routed or composed application behavior
- a visual regression check for pixel/layout fidelity
- dropping the test when it would only freeze private implementation

Examples:

- Prefer `expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()`
  over checking disabled class names.
- Prefer clicking a control and asserting that visible text changes over
  asserting `data-open`, `data-state`, or internal trigger classes.
- Prefer `expect(screen.getByRole('dialog', { name: 'Saved' }))` over finding a
  component root by `[data-slot="toast"]`.
- Do not unit-test animation implementation such as `data-expanded`,
  `data-promoted`, transform classes, or stack positioning; ask whether to cover
  it with Storybook/browser/visual tests instead.
- Do not assert icon SVG internals. If icon presence matters to users, expose and
  assert an accessible label; otherwise treat decorative icons as visual styling.

Required tooling defaults across apps and packages:

- `@testing-library/react`
- `@testing-library/user-event`
- `prepareSetup` from `@ordero/test-config/react` for component test setup, unless a one-off `render(...)` makes required surrounding structure clearer
- Vitest globals (`describe`, `it`, `expect`, `vi`, etc.) without per-file imports

Testing layer split for `packages/ui`:

- use `pnpm --dir packages/ui test` for the `unit` Vitest project
- use `pnpm --dir packages/ui test:storybook` for the Storybook Vitest project and browser-backed a11y coverage
- use Playwright for app-level composed flows rather than as the default shared-component test layer

For app feature/component tests outside `packages/ui`:

- use Testing Library and `@testing-library/user-event` for component-local behavior such as form validation timing, blur/change interactions, disabled states, reset behavior, and user-visible messages
- use Playwright for routed/composed app flows, smoke coverage, browser integration, and behavior that depends on the real browser page
- prefer role/name queries when available; use `getByLabelText` for inputs that do not expose a queryable role in jsdom, such as `input[type="password"]`
- configure app TypeScript/Vitest so Vitest globals are available in test files; do not import Vitest globals per file as a workaround
- when an app-level `prepareSetup` helper exists, prefer it over the shared helper so app providers and test defaults stay consistent
- if no app-level `prepareSetup` helper exists, use the shared helper from `@ordero/test-config/react`
- use `prepareSetup` as the base render helper, and layer a small local `setup...` helper on top when the test needs named queried elements or a `userEvent` instance
- for request-driven component and hook tests, mock the nearest app-owned request helper rather than transport details
- for request-driven component tests, assert user-visible behavior and request-helper contract rather than internal cache or state-container data

For the repo-specific accessibility testing workflow, see `references/accessibility-testing.md`.

For shared component tests with repeated default props, use `prepareSetup`.
When a `prepareSetup` test overrides a prop and later asserts on that prop, destructure the asserted value from the object returned by `setup(...)` instead of keeping a separate local variable for the same override.
Use plain `render(...)` only for one-off tests that need surrounding structure such as forms, extra focus targets, or similar setup that would be less clear with `prepareSetup`.
See `references/prepare-setup-example.md` for the canonical pattern.

## CSS Variable Conventions

Treat these rules as mandatory for UI work in both `packages` and `apps`.

Always review the token system in this order before introducing or changing UI values:

1. `packages/ui/src/styles/globals.css`
2. the files imported by `globals.css` under `packages/ui/src/styles`
3. `docs/ui-tokens.md`

Required rules:

- Keep raw imported Figma values in the `--figma-*` layer only.
- Raw `--figma-*` tokens are forbidden in component code.
- Use existing semantic or bridged tokens instead of raw Figma tokens in component code.
- If a needed spacing, radius, color, typography, shadow, sizing, or component token already exists in `packages/ui/src/styles`, you must use it instead of introducing a hard-coded value.
- Hard-coded px/rem/hex/rgba values in component code are forbidden when an existing token already represents that value or intent.
- Do not introduce one-off semantic globals casually.
- Do not make up new semantic or bridged tokens until you have reviewed the existing token files.
- If an existing semantic or bridged token covers the need, reuse it.
- Only add a new token mapping when the needed value truly does not exist in the current token layers.

For Figma-driven implementation:

- Treat `packages/ui/src/styles/globals.css` as the styling entry point and source of truth for token lookup.
- Map Figma spacing, radius, color, typography, shadow, and component sizing to existing `packages/ui/src/styles` tokens whenever possible.
- Use tokenized values for layout shells too, not only inside shared controls.
- Do not approximate Figma values with nearby hard-coded values when the exact token already exists.
- Do not add responsive overrides that change tokenized spacing, radius, or sizing unless the design explicitly specifies a breakpoint change.
- If the design appears to require a value that is not in the current token system, verify that it is truly missing before adding a new token or using a temporary hard-coded fallback.

Violation examples:

- replacing an existing `24px` token with `px-6` or `px-[24px]` in app UI when a shared spacing token exists
- adding `sm:px-10` or similar overrides that change Figma-defined padding without design evidence
- using direct `rgba(...)` or hex values for layout styling when a semantic or bridged token already exists
- adding ad hoc card/container values without checking `globals.css` and the imported token files first

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

- keep app-level client context in a single `AppProviders` component near the app root; add new app-wide providers there instead of creating parallel provider wrappers in `layout.tsx`
- prefer semantic HTML elements over generic `div` and `span` wrappers when the content has clear structural meaning such as navigation, lists, sections, headers, footers, or other landmark/sectioning roles
- use non-semantic wrappers only when semantic elements would be incorrect for the content or when a library primitive constrains the rendered element
- prefer Base UI primitives/components whenever a matching primitive/component exists
- prefer explicit component props for design-system components
- do not expose `className` on shared `packages/ui` components
- keep stories and tests aligned with the public API, not internal structure
- preserve consistency with existing components unless there is a deliberate architectural improvement
- do not move field-level helper text or error-text expectations into low-level primitives if wrapper components own that part of the API
- keep component-specific styles in the component folder, for example `packages/ui/src/components/[ComponentName]/styles.css`, and import them from the component module that needs them
- reserve `packages/ui/src/styles/globals.css` and its imported files for global base styles, design tokens, Tailwind theme exposure, and genuinely shared style layers

For `packages/ui` specifically:

- prefer stable exports from `packages/ui/src/index.ts`

## Validation

Run the smallest useful package-level checks for the files you touched.

For `packages/ui`, prefer:

- `pnpm --dir packages/ui format`
- `pnpm --dir packages/ui typecheck`
- targeted `pnpm --dir packages/ui test ...`
