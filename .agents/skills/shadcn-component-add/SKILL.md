---
name: shadcn-component-add
description: Add a new shared UI component to this monorepo using shadcn and local conventions. Use when asked to create, scaffold, or wire a component in packages/ui, including placement under packages/ui/src/components/[ComponentName], local types.ts and index.ts files, root export updates in packages/ui/src/index.ts, Vitest + RTL tests, and Storybook story creation.
---

# Shadcn Component Add

Follow this workflow every time.

## 1. Confirm target and naming

- Ask for the component name if missing.
- Use PascalCase for folder and component names.
- Create component folder at `packages/ui/src/components/[ComponentName]`.
- If the request includes type, naming, or TS/JS style constraints, also apply `coding-conventions`.

## 2. Scaffold with shadcn

- From repo root, run:

```bash
pnpm shadcn:add <component-token>
```

- This maps to root script `shadcn:add` and runs shadcn inside `packages/ui`.
- Move or adjust generated files so the final structure matches this skill.

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
- Assert an accessible role/name or visible content.
- Use `describe/it/expect` from `vitest`.

## 5. Add Storybook story

- Add story under `packages/ui/stories/[ComponentName].stories.tsx`.
- Include a default export meta + at least one usable story variant.

## 6. Validate wiring

- Verify imports resolve and exports are reachable from `packages/ui/src/index.ts`.
- Run targeted tests for the new component when possible.
- Run Storybook checks when requested.

## Testing and typing preferences

- For evolving preferences, keep details in `references/testing-and-types.md`.
- Keep this SKILL.md focused on stable workflow rules.
