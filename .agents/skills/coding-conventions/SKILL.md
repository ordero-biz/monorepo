---
name: coding-conventions
description: Use when adding or changing any TSX/TS file.
---

# Coding Conventions

Apply these conventions in touched files.

## 0. Handle convention conflicts

- If a user request conflicts with any rule in this skill, pause and ask for explicit confirmation before overriding.
- Use a direct question, for example: `This conflicts with coding-conventions rule "<rule>". Do you want to override it for this task?`
- If confirmation is not given, follow the skill rules.

## 1. Prefer `type`

- Use `type` aliases instead of `interface`.

## 2. Name component props

- Name component prop types as `type [ComponentName]Props`.
- Keep prop types close to the component, usually in local `types.ts`.

## 3. Prefer object args for many params

- If a function takes more than two parameters, pass a single object argument instead.
- Name that object type `type [FunctionName]Args` when a named type is needed.
- Keep existing external signatures unchanged when compatibility requires positional args.

## 4. Prefer arrow functions

- Prefer arrow functions for new functions in app code.
