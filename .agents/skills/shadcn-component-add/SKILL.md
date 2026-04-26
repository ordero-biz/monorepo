---
name: shadcn-component-add
description: Legacy entry point for adding shared UI components in packages/ui. Use when asked to create, scaffold, or wire a component in packages/ui, then follow ui-component-build for the current project-specific workflow and ui-routine-conventions for testing and token decisions.
---

# Shadcn Component Add

This skill remains as a compatibility trigger, but the current project workflow lives in:

- `ui-component-build`
- `ui-routine-conventions`

Use this skill as the entry point when a request clearly means "add a new shared UI component", then always follow the two newer skills above for implementation details.

## Current Positioning

- Use shadcn-style component structure and APIs.
- Use Base UI primitives/components by default when a matching primitive/component exists.
- Keep styling aligned with the project's Tailwind + token architecture.
- Reuse existing tokens from `packages/ui/src/styles` before adding any new token mapping.
- Do not use raw `--figma-*` tokens in component code.
- Keep tests behavior-focused rather than implementation-focused.

## 1. Confirm target and naming

- Ask for the component name if missing.
- Use PascalCase for folder and component names.
- Create component folder at `packages/ui/src/components/[ComponentName]`.
- Also apply `coding-conventions`.

## 2. Scaffold with shadcn

- Use shadcn scaffolding only when it helps materially.
- Do not force a generator step if a manual implementation is cleaner or the component needs a Base UI primitive wrapper.
- If you do scaffold, start from repo root:

```bash
pnpm shadcn:add <component-token>
```

- This maps to root script `shadcn:add` and runs shadcn inside `packages/ui`.
- Move or adjust generated files so the final structure matches the project conventions.

## 3. Enforce component structure

Inside `packages/ui/src/components/[ComponentName]`, ensure:

- `[ComponentName].tsx`
- `types.ts`
- `index.ts`
- `[ComponentName].test.tsx`
- Any local support files (for example `constants.ts`) if needed

Type rules:

- Put exported prop types in `types.ts`.
- Import types into `[ComponentName].tsx` via `import type`.
- Keep component logic out of `types.ts`.

Export rules:

- Local barrel (`packages/ui/src/components/[ComponentName]/index.ts`) exports component and local public helpers.
- Root barrel (`packages/ui/src/index.ts`) exports the new component so apps can import it.

## 4. Add tests (Vitest + RTL)

Create `packages/ui/src/components/[ComponentName]/[ComponentName].test.tsx`.

Minimum test baseline:

- Render test with `@testing-library/react`.
- Prefer role/name assertions and user-observable behavior.
- Use `@testing-library/user-event` for interactions.
- Rely on Vitest globals in `packages/ui` instead of importing `describe/it/expect` per file.

## 5. Add Storybook story

- Add story under `packages/ui/stories/[ComponentName].stories.tsx`.
- Include a default export meta + at least one usable story variant.

## 6. Validate wiring

- Verify imports resolve and exports are reachable from `packages/ui/src/index.ts`.
- Run targeted tests for the new component when possible.
- Run Storybook checks when requested.
- Run `pnpm --dir packages/ui format` and `pnpm --dir packages/ui typecheck` when possible.
