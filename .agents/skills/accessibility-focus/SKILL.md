---
name: accessibility-focus
description: Use when adding or refactoring initial focus, invalid-field focus, or trigger focus restoration in store app editors. Reuse the accessibility hooks and verify their lifecycle instead of adding per-field refs or duplicated focus effects.
---

# Accessibility Focus

Read [Accessibility Focus Hooks](../../../docs/accessibility-focus.md) for the
APIs, integration examples, limitations, and test commands. The implementations
and their tests live in `apps/store/src/lib/hooks/accessibility`.

## Choose the owner

- For a newly mounted inline editor, use `useInitialFocus()` on its wrapper.
  Use `{ preferInvalid: true }` when initial field errors should take priority.
- For returning to a trigger, use `useRestoreFocus(isOpen)` in the workflow
  component that stays mounted, and attach its returned ref to the trigger.
- If a shared dialog or popover already manages focus, use that component's
  focus API. Do not add competing focus effects.

## Preserve the lifecycle

- Mount the initial-focus hook with its controls. It schedules a single scan;
  it does not observe delayed content or respond to CSS visibility toggles.
  Keep `preferInvalid` stable during an editing session unless refocusing is
  intentional.
- Let rendered `aria-invalid` attributes identify rejected controls or groups.
  Keep field names, validation, error storage, and editor-opening decisions in
  the feature workflow. Do not rebuild a field-specific ref list.
- Keep the restoration owner mounted across open and closed states. Render
  the trigger in the commit that closes the editor; a missing target is a
  no-op. Use this hook for a known return target, not navigation or focus traps.
- Import through `@/lib/hooks/accessibility/useInitialFocus` or
  `@/lib/hooks/accessibility/useRestoreFocus` in the store app. Other apps must
  not import store internals; assess a shared package if reuse is needed.

## Validate the user-visible result

Follow the repo's TS/React and UI testing conventions. Cover the behavior
affected by the change: initial focus, invalid-field priority, Apply/Cancel
restoration, or focus preservation during rerenders. Use role/name queries and
focus assertions; wait for the animation frame when testing initial focus.
Use browser coverage when CSS visibility, overlays, or portals determine the
result. Run the focused tests and typecheck, and keep the documentation aligned
when changing a hook's public behavior.
