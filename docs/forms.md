# Form Architecture

This project uses a client-first form architecture for internal applications.
TanStack Form manages form state in the app, Zod handles client validation, and
the backend remains the authoritative validation boundary before writes.

The goal is to keep form behavior predictable for users while keeping shared UI
components reusable and free of form-library coupling.

## Principles

- Shared UI components stay presentational.
- Form-library wiring stays in app features.
- Client validation exists for UX, not authority.
- Backend validation is still required before success.
- Form behavior should be consistent across features.

## Boundaries

### `packages/ui`

`packages/ui` owns reusable presentational controls such as `TextField`,
`Checkbox`, `Select`, `Button`, and other form-adjacent primitives.

These components:

- must not import TanStack Form
- must not depend on app feature state
- should accept ordinary controlled props
- should be reusable with any form library or no form library

### `apps/*/src/features/*`

Each feature owns its own form behavior.

Feature code is responsible for:

- default values
- validation schemas
- field-level validation functions
- submit handling
- backend error mapping
- route- or feature-specific form UI

## Recommended Feature Structure

Keep form logic inside the feature that owns the workflow.

Typical structure:

- `constants.ts` for default values and simple static configuration
- `utils/validations.ts` for Zod schemas and small validation helpers
- `utils/error.ts` for error normalization and message extraction
- `Form.tsx` or feature-specific form component for TanStack Form wiring and rendering

This structure is guidance, not a rigid scaffold. A very small form may not
need every file.

## Validation Model

Use Zod for client validation and the backend for authoritative validation.

Recommended UX behavior:

- do not show client validation errors on the first keystroke
- show client validation errors after the user has blurred the field once
- once a field has been revealed as invalid, update its validity live while the user corrects it
- always show submit or backend field errors, even if a field was never blurred

This produces a calmer UX than immediate validation while still helping the
user fix problems quickly.

## Submit Model

Use TanStack Form in the feature component and handle submit through the form's
`onSubmit`.

Submit flow should be:

1. collect current field values from TanStack Form
2. submit to the backend or feature submit adapter
3. map backend field errors back into the form with `setErrorMap`
4. keep backend validation authoritative

Client validation should never be treated as a replacement for backend
validation.

## Error Handling

Treat client and submit errors as separate concerns.

- client validation errors should support inline correction
- submit or backend errors should be mapped back to fields when possible
- form-level submit errors should be rendered in a form-level error area
- field-level submit errors should not depend on prior blur state to become visible

Keep error-message extraction logic centralized when possible so forms stay easy
to read.

## Shared Fields

When a field behavior is common across forms and not specific to one feature, it
can move into `packages/ui` as a shared presentational control.

Examples of behavior that may justify a shared field:

- repeated adornment behavior
- repeated accessibility behavior
- repeated interaction logic that is not tied to TanStack Form

The rule is still the same: shared fields remain presentational and
form-library agnostic.

## Styling

Form layout and controls should follow the shared token system in
`packages/ui/src/styles`.

At a high level:

- use existing semantic and bridged tokens before introducing hard-coded values
- keep shared controls aligned with `packages/ui`
- keep feature layouts consistent with the design-token architecture documented in `docs/ui-tokens.md`

## When To Add More Structure

This is the first real form, so the architecture should stay high level for
now.

Add stricter conventions later only when multiple forms reveal stable repeated
patterns, such as:

- repeated submit adapters
- repeated field error precedence rules
- repeated feature folder layouts
- repeated shared field abstractions
