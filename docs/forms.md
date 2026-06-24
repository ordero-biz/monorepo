# Form Architecture

This project uses a client-first form architecture for internal applications. TanStack Form manages form state in the app, Zod handles client validation, and the backend remains the authoritative validation boundary before writes.

The goal is to keep form behavior predictable for users while keeping shared UI components reusable and free of form-library coupling.

## Principles

- **Shared UI components stay presentational** and decoupled from form libraries.
- **Form-library wiring stays in app features**, keeping logic local to the workflow.
- **Client validation exists for UX, not authority**. The backend is the ultimate source of truth and validation before writes.
- **Consistent UX flows** across all application features.

## Boundaries

### `packages/ui`
Owns reusable presentational controls (e.g., `TextField`, `Checkbox`, `Select`, `Button`).
- Must not import TanStack Form or depend on app feature state.
- Must accept ordinary controlled props and be reusable with any (or no) form library.

### `apps/*/src/features/*`
Owns form-specific layouts, behavior, and states:
- Default values and static configurations.
- Zod validation schemas and field-level validators.
- Submission handling, backend error mapping, and feature-specific layout.

---

## Recommended Structure & Canonical Flow

To keep forms predictable and consistent, start with the smallest readable
feature-owned structure and split along responsibility boundaries as the flow
grows:

```
feature-folder/
├── FeatureFlow.tsx            # dialog/page/drawer workflow and side effects
├── FeatureForm.tsx            # <form>, layout, fields, submit button
├── hooks/
│   └── useFeatureForm.ts      # form setup, submit orchestration, errors
├── constants.ts               # default values and static configs
└── utils/
    ├── submitAction.ts        # request call and backend error normalization
    └── validations.ts         # Zod schema and client validators
```

The actual names should stay domain-specific. A simple page form may combine
the workflow, form component, and hook responsibilities while it remains easy
to read. Extract a form hook or field section when submit handling, backend
error mapping, query invalidation, navigation, dialog reset, or dense field
groups start competing inside the same component.

### Flow Lifecycle
1. **Initialize**: Define defaults in `constants.ts` and Zod schema in `validations.ts`.
2. **Setup**: Instantiate TanStack Form inside the feature form or feature hook, passing controlled props to presentational fields from `packages/ui`.
3. **Validate UX**: Reveal client validation errors on **blur**, then update validation state **live** during correction.
4. **Submit**: Collect values via `onSubmit` and call the feature-owned submit action or client request helper.
5. **Handle Errors**: Map backend field errors to the form state using `setErrorMap`, and show form-level errors through the shared toast surface.
6. **Finish Workflow**: Keep route navigation, dialog close/reset, and TanStack Query cache invalidation in the workflow layer or the simple route form that owns the workflow.

---

## Validation & UX Model

To ensure a calmer, less intrusive user experience, implement this validation visibility model:

- **Do not show client validation errors on the first keystroke.**
- **Show client validation errors only after a user blurs the field once** (`blur-first` visibility).
- **Once a field is marked invalid, validate live** as the user edits, providing immediate positive reinforcement when corrected.
- **Always show backend/submit errors immediately**, even if the field was never blurred.

Ensure these field-level interaction rules are covered by unit/component tests, and use Playwright for integrated page-level testing (see `docs/testing.md`).

---

## Error Handling

Treat client validation and backend/submit errors as separate concerns:

- **Client Errors**: Focused on inline correction guided by the Zod schema.
- **Submit/Backend Errors**: use the shared helpers from
  `@/lib/utils/form/error` for common field-message parsing and
  submit/change precedence.
  - **Field-level errors** must be mapped back to fields using `setErrorMap`.
  - Use `getFieldSubmitChangeErrorText(...)` when a field needs the standard
    behavior: submit/backend errors win, while change errors are shown only
    after blur.
  - Use `getErrorMessage(...)` for single submit-only controls such as
    checkbox agreement fields.
  - **Form-level errors** must use the shared toast surface. Persistent inline form-level error elements are discouraged unless explicitly required by the workflow design.
  - **Precedence**: When client and backend errors overlap, show the error message that best explains the current interactive state.

> [!NOTE]
> We do not yet define a shared backend submit adapter. Keep request-specific
> backend error mapping in the feature, and use the shared form error helpers
> only for common display/message behavior.

---

## Shared Fields

Common controls can be moved into `packages/ui` as shared presentational components only if they require:
- Repeated visual adornments or icons.
- Repeated accessibility attributes (ARIA markup).
- Complex presentational interactive states decoupled from form-library schemas.

Keep the component in the local feature if it requires knowledge of TanStack Form state, submit state, schema knowledge, or backend response formats.

## Form Hook Tests

Use the app-local `prepareFormHookTestSetup` helper when a hook test only needs
to submit the form and assert submit-side effects. Both `apps/platform` and
`apps/store` provide this helper under `src/test/prepareFormHookTestSetup`.

Use hook tests for behavior such as:

- success callbacks receiving the smallest useful result
- backend field errors being mapped through `setErrorMap`
- form-level submit errors being shown through toasts
- success callbacks not firing on failure

Keep field labels, visible validation messages, and field-array interactions in
feature form/component tests instead.

---

## Styling

Form layouts and controls must follow the shared token system in `packages/ui/src/styles`.
- Leverage existing semantic and bridged tokens (see `docs/ui-tokens.md`) before introducing hard-coded values.
- Keep shared controls visually aligned with the `packages/ui` design system.

## Future Evolution

This architecture remains high-level for now. Introduce stricter shared abstractions (such as repeated submit adapters or centralized error adapters) only when patterns stabilize across three or more features.
