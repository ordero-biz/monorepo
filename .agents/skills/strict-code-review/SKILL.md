---
name: strict-code-review
description: Use when reviewing code, pull requests, patches, or diffs in this repo and the goal is to find repo-specific bugs, regressions, missing validation, UI token misuse, shared-component convention breaks, accessibility issues, or architectural risks that automated TypeScript and Biome checks do not fully cover. Applies to strict, repo-specific reviews across apps and packages.
---

# Strict Code Review

Use this skill for repository code reviews.

This skill is review-only. It is for finding issues, not for authoring new code conventions from scratch.

## Review posture

- Default to a code review mindset: identify bugs, regressions, risky assumptions, convention breaks that matter, and missing tests or validation.
- Default the review scope to touched files and directly affected neighbors.
- Expand into related imports, exports, stories, tests, tokens, and consumers only when that context is needed to judge impact.
- Treat full-project review as out of scope unless the user explicitly asks for a repo-wide audit.
- Findings come first. Summaries are secondary.
- Prefer high-signal findings over broad stylistic commentary.
- Do not invent style rules that are not supported by the repo configs, docs, or local skills.
- Treat automated checks as the baseline for mechanical enforcement, not as the main review output.
- If there are no findings, say that explicitly and mention any residual risk or validation gap.

## Output contract

- Order findings by severity.
- Include precise file and line references when available.
- Explain why the issue matters in runtime, maintenance, accessibility, design-system, or validation terms.
- Prefer actionable findings to vague advice.
- Call out missing verification when the change touches behavior but no meaningful check was run.

Use this lightweight severity rubric:

- `P1`: likely to break real usage on an important path and should normally block merge until fixed
- `P2`: important regression risk, architecture break, or validation/testing gap that should be fixed but is less urgent than `P1`
- `P3`: lower-risk inconsistency, maintainability problem, or weaker coverage that is worth fixing but is unlikely to break core usage immediately

## Review scope

Use this default scope unless the user asks for something broader:

- review touched files first
- inspect directly affected neighbors as needed for context
- inspect related imports, exports, stories, tests, tokens, and consumers only when needed to judge impact

Do not turn a normal review into a whole-project audit just because you notice unrelated pre-existing issues.

Use full-project scope only when the user explicitly asks for it.

## Evidence bar

Raise a finding when at least one of these is true:

- the change can break behavior, type safety, accessibility, or imports/exports
- the change weakens an established repo rule from `AGENTS.md`, local skills, or the authoritative project configs and scripts
- the change introduces a likely regression or leaves an important path untested
- the change bypasses an existing architectural pattern and creates future inconsistency with real cost

Do not raise a finding for pure preference unless the preference is already codified in this repo.

Do not spend review attention on issues that are already fully and reliably covered by automated checks unless:

- the checks were not run
- the diff is likely to fail those checks
- the violation signals a broader design or maintenance problem beyond the raw lint or type error

## Authoritative automation and docs

Treat these as the source of truth for mechanical enforcement:

- `biome.json`
- the relevant `tsconfig*.json`
- package scripts such as `format`, `lint`, `typecheck`, and `test`
- `ts-react-conventions` for TS and TSX authoring expectations
- `ui-component-build` and `ui-routine-conventions` for shared UI expectations

The review skill should not copy those rules into prose or try to become a second linter spec.

Use them in review like this:

- assume routine formatting, lint, and compiler violations belong to automated checks
- mention missing or failing checks as review context
- escalate only when a config violation points to a broader design, safety, or maintenance problem

Keep the human review focus on issues that configs do not judge well, such as:

- unsafe type escapes like `as any`, `@ts-ignore`, or broad assertions used to dodge modeling work
- signatures or APIs that are technically valid but awkward, ambiguous, or easy to misuse
- broken imports, exports, or alias usage that suggest structural drift
- convention breaks from `AGENTS.md` and local skills that reflect architecture, not formatting

## Docs to consult by change type

Use this map to load the smallest relevant source of truth for the diff:

- forms and validation: `docs/forms.md`, `docs/testing.md`
- shared UI components in `packages/ui`: `ui-component-build`, `ui-routine-conventions`
- shared UI component API shape: `docs/ui-components.md`
- tokens, CSS variables, and Tailwind exposure: `docs/ui-tokens.md`, `ui-routine-conventions`
- TS and TSX authoring conventions: `ts-react-conventions`
- shared UI accessibility testing: `docs/accessibility-testing.md`

## Convention enforcement in review

For TS and TSX changes, use `ts-react-conventions` as the authoring baseline.

Do not restate routine convention nits in review when they are already handled clearly by automation or are low-impact one-off style issues.

Raise a convention finding when the change:

- creates inconsistency in a shared pattern or repeated module shape
- weakens a public API or makes it harder to use correctly
- makes types less safe, less clear, or easier to bypass
- breaks the expected repo structure, import flow, or export flow
- bypasses token, component, or testing boundaries established by local skills

Do not raise a convention finding when the issue is only:

- a minor local style nit with no broader impact
- a formatting concern that Biome will rewrite automatically
- a line-by-line lint or type error already reported clearly by automated checks

## UI review rules

When the diff touches UI components, styles, stories, or tests, also apply the repo UI skills.

### For all UI work in apps and packages

- prefer behavior-first tests over implementation-detail assertions
- favor accessible role and name coverage for user-facing behavior
- avoid asserting class names, token names, or `cva` internals when a user-visible signal exists
- check whether the change preserves the semantic token architecture described in `docs/ui-tokens.md`
- for component tests across `apps` and `packages`, expect `prepareSetup` to be the default when the file has repeated default props or a stable wrapper; treat ad hoc render helpers as the exception
- for `prepareSetup`-based tests, expect overridden props that are later asserted on to be destructured from `setup(...)` rather than tracked in separate local variables

From `AGENTS.md` and local skills, pay particular attention to:

- keeping raw Figma values in the `--figma-*` layer
- forbidding raw `--figma-*` tokens in component code
- preferring existing semantic or bridged tokens in component code
- reviewing `packages/ui/src/styles/globals.css` as the token entry point, then the imported token files under `packages/ui/src/styles`, before claiming a token is missing
- exposing shared semantic tokens through `@theme inline` only when that reuse is justified
- keeping component-specific selectors, keyframes, and other local CSS in that component's folder instead of `packages/ui/src/styles/globals.css`

Read `docs/ui-tokens.md` when the review touches:

- CSS variables
- token files
- Tailwind theme exposure
- raw `--figma-*` usage

### For shared components in `packages/ui`

Also enforce the `ui-component-build` and `ui-routine-conventions` expectations:

- keep the established folder structure for shared components
- prefer Base UI primitives or components when a matching primitive exists
- keep public APIs explicit
- do not expose `className` on shared `packages/ui` components
- keep exported prop types in local `types.ts`
- for new shared compound components, expect the Base UI-style namespace export pattern: `[ComponentName].Root`, `[ComponentName].Trigger`, etc., wired through `index.parts.ts` and `export * as [ComponentName] from './index.parts'`
- ensure stable exports from `packages/ui/src/index.ts`
- expect Storybook stories that cover meaningful public variants
- expect behavior-focused tests for meaningful interactions and states
- expect component-specific CSS files to live inside the component folder when Tailwind class strings are not enough

Current `packages/ui` structure to review against:

- shared components live in `packages/ui/src/components/[ComponentName]`
- each component folder should keep the component file, local `types.ts`, local `index.ts`, and unit test file together
- unit test files should live next to the file they cover, for example `Button.test.tsx` beside `Button.tsx`
- shared stories live in `packages/ui/stories/[ComponentName].stories.tsx`
- package-wide exports should stay wired through `packages/ui/src/index.ts`

Current import and export patterns to review against:

- use local relative imports such as `./types` inside a component folder
- use the `@/ui/...` aliases for cross-component and shared-library imports inside `packages/ui`
- keep component public entrypoints flowing through each local `index.ts`
- avoid new `Object.assign(root, { Part })` compound APIs unless explicit backward compatibility requires callable shorthand
- keep consumer-facing exports flowing through `packages/ui/src/index.ts`

Missing exports, misplaced files, tests not colocated with the file they cover, overly broad prop passthrough, absent tests for interactive behavior, or styling that bypasses the token system should usually be findings.

## TanStack Table review rules

When the diff touches `@tanstack/react-table`, `useReactTable`, shared table primitives, or table column defs:

- check whether `columns`, `data`, and controlled table state passed to `useReactTable` keep stable references across renders
- treat inline `columns` or `data` array recreation in the same render path as a likely finding because the TanStack FAQ warns this can trigger infinite re-render loops
- treat inline data transformations passed into `useReactTable`, such as `data.filter(...)`, `data.map(...)`, or `data.slice(...)`, as a likely finding unless the derived value is memoized first
- when a table exposes controlled sorting state such as `sorting` and `onSortingChange`, or otherwise appears intended for server-driven sorting, verify whether client-side sorting is still being applied implicitly
- treat always-on `getSortedRowModel()` without a `manualSorting` path as a likely finding when the component API suggests server-side sorting support
- when `manualSorting` or server-side sorting support is introduced, expect targeted tests that confirm sorting state updates without local row reordering
- when data updates are introduced alongside sorting, selection, pagination, or expanding behavior, verify whether TanStack auto-reset behavior is still desired and whether that expectation is tested

## Form review rules

When the diff touches feature forms, form validation, submit handling, or
backend error mapping, also review against `docs/forms.md` and `docs/testing.md`.

Expect the form architecture to preserve these boundaries:

- TanStack Form wiring stays in feature code
- Zod schemas and validation helpers stay feature-owned
- shared UI fields remain presentational and form-library agnostic
- backend validation remains authoritative over client validation

Expect the validation UX to preserve these defaults unless the feature has a
clear documented reason to differ:

- do not show client validation errors on the first keystroke
- show client validation errors after blur
- once a field has been revealed as invalid, update its validity live while the user corrects it
- show submit or backend field errors even if the field was never blurred

Review submit and error handling for:

- backend field errors being mapped back into the form in the feature layer
- form-level submit errors being rendered in a form-level error area
- field-level submit errors not depending on prior blur state to become visible
- client validation not being treated as a replacement for backend validation

When form behavior changes, expect targeted tests that cover the user-visible
validation and submit behavior. Use `docs/testing.md` as the source of truth for
the testing split between component tests and Playwright flows.

## Validation expectations

A strict review should mention whether the author ran the smallest relevant checks for the touched area.

Treat these checks as required review context, not as the main content of the findings list.

Prefer these commands as the validation baseline:

- repo-wide formatting expectations: `pnpm format` or `pnpm format:write`
- repo-wide type expectations: `pnpm typecheck`
- `packages/ui`: `pnpm --dir packages/ui format`, `pnpm --dir packages/ui typecheck`, and targeted `pnpm --dir packages/ui test ...`
- `apps/platform`: `pnpm --dir apps/platform format`, `pnpm --dir apps/platform typecheck`, and targeted `pnpm --dir apps/platform test ...`
- `apps/store`: `pnpm --dir apps/store format`, `pnpm --dir apps/store typecheck`, and targeted `pnpm --dir apps/store test ...`

If checks were not run, note that as residual risk. If the diff changes runtime behavior and no targeted test exists, consider that a finding.

## Review workflow

1. Identify the touched area:
   `packages/ui`, `apps/platform`, `apps/store`, tokens/styles, tests, or shared infrastructure.
2. Set the review scope:
   touched files first, then directly affected neighbors and related imports, exports, stories, tests, tokens, or consumers only when needed.
3. Map the diff to the relevant repo rules:
   project configs and scripts are authoritative for mechanical checks; UI/token skills apply when relevant.
4. Check whether automated validation was run or is likely to fail.
5. Look for concrete breakage or risk before style commentary.
6. Check whether the change preserves the repo architecture:
   types, exports, tokens, component APIs, and test philosophy.
7. Report only findings that clear the evidence bar.

## Review questions

Use these questions to sharpen the review before writing findings:

- what user-visible behavior changed?
- what can fail silently or only after integration?
- what existing repo pattern, boundary, or helper does this diff rely on?
- did the change bypass an existing pattern for a clear reason?
- what path in this change is least covered by tests?
- if this change is wrong, where would the user or the next maintainer feel it first?

## What strong findings look like

- a new shared UI component exposes `className`, breaking the repo’s design-system boundary
- a component uses raw `--figma-*` tokens
- a change invents new semantic tokens without first reusing or exhausting the existing token layers in `packages/ui/src/styles`
- a component test introduces an ad hoc render helper even though `prepareSetup` would cover repeated default props or a stable wrapper more cleanly
- a `prepareSetup`-based test asserts on an overridden prop through a separate local variable instead of destructuring the asserted value from `setup(...)`
- a TS change relies on `as any`, `@ts-ignore`, or broad assertions to bypass a modeling problem
- a refactor removes behavior coverage and leaves interactive paths unverified
- a shared component is added but not exported from `packages/ui/src/index.ts`
- a `packages/ui` test file is placed away from the component instead of next to the file it covers
- a shared component or story is added in a location that breaks the current `packages/ui` structure or import flow

## What not to over-report

- harmless formatting nits that Biome will rewrite automatically
- line-by-line lint or type issues that automated checks already report clearly
- subjective naming preferences with no repo rule behind them
- requests for more abstraction unless duplication or API drift is a real problem
