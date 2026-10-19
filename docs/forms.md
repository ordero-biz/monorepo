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

Follow `docs/features.md` for the broader feature folder shape. Form workflows
should live inside the relevant logical feature folder, such as `list/CreateX`,
`detail/UpdateX`, `detail/DeleteX`, or a standalone `add/` workflow.

To keep forms predictable and consistent, start with the smallest readable
feature-owned structure and split along responsibility boundaries as the flow
grows:

```
feature-folder/list/CreateFeature/
├── FeatureFlow.tsx            # dialog/page/drawer workflow and side effects
├── FeatureForm.tsx            # <form>, layout, fields, submit button
├── hooks/
│   └── useFeatureForm.ts      # form setup, submit orchestration, errors
├── constants.ts               # default values and static configs
├── types.ts                   # component props and workflow-local types
├── index.ts                   # public entrypoint for this workflow
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

## Partial Updates

For a `PATCH` form, keep form values and API request data separate. Form values
may use UI-specific representations such as `string | null` ids, while the API
expects normalized values such as `number | null` and may also serve non-form
commands.

The feature submit utility should normalize both the initial and submitted form
values, compare them, and pass only changed fields to the API helper. When no
normalized fields changed, do not send a PATCH; let the workflow close or reset
through its explicit no-op behavior.

For optional text fields, define the transport meaning of an empty form value
at the feature boundary:

- On create, omit a blank optional value unless the endpoint explicitly
  requires `null`.
- On update, send `null` when a previously populated optional value is cleared;
  omitting that field would preserve the existing backend value.
- Treat blank and absent form values consistently while comparing normalized
  data, so an unchanged empty value does not create a PATCH.

Create and update may need different payload assembly because omission and
clearing have different meanings. Keep those command-specific rules local; only
extract a shared field normalizer when the same pure normalization rule is used
by several workflows.

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

### Combobox Fields

Use `Select` for short, fixed option sets where search is not needed. Use
`Combobox` for searchable options, textbox-style filtering, or multiple
selection with chips.

Wire form-owned combobox fields through ordinary controlled props:

```tsx
<Combobox
  errorText={errorText}
  getOptionLabel={(option) => option.name}
  getOptionValue={(option) => String(option.id)}
  invalid={Boolean(errorText)}
  label="Related record"
  name={field.name}
  onBlur={field.handleBlur}
  onValueChange={field.handleChange}
  options={options}
  placeholder="Select a record"
  size="s"
  value={field.state.value}
/>
```

Use `value: TOption | null` for single selection. Use `multiple={true}` with a
`TOption[]` value for multiple selection. Options are serializable records;
`getOptionValue` identifies them and `getOptionLabel` provides their display text.

For request-backed option lists, create a feature-owned or app-owned resource
wrapper such as `ResourceAsyncCombobox` instead of putting request/query logic
directly inside the form markup. The wrapper should own:

- the request helper and option mapping
- pagination, sorting, filters, and page size
- loading, empty, and load-error copy
- the TanStack Query key used for the option cache

Keep the query key under the same resource prefix used for invalidation, then
add an `options` segment so option data does not collide with list-page data:

```ts
const resourceOptionsQueryKey = [
  ...resourceQueryKeys.list,
  'options',
] as const;
```

Include request parameters that can vary, such as page size, filters, or sort,
in the key. Fixed wrapper-owned parameters can stay in the wrapper, but the key
should still be resource-aligned so
`invalidateQueries({ queryKey: resourceQueryKeys.list })` refreshes related
option caches after writes.

When a wrapper intentionally forwards props explicitly instead of using
`{...props}`, forward every retained `Combobox` prop. This includes form and
accessibility props (`name`, `onBlur`, `aria-label`, `aria-labelledby`,
`aria-describedby`) and visual props such as `size` and `variant`.

### Selection records and submission

`Combobox` and an app-owned `AsyncCombobox` use object-valued selections.
`AsyncCombobox` adds paginated option loading and caching to the same selection
API. Feature wrappers supply the request helper and record accessors.

- Single selection uses `TOption | null`; multiple selection uses `TOption[]`.
- `getOptionValue` returns a stable, unique string ID for equality and native
  form serialization. Object identity and display labels do not define equality.
- `getOptionLabel` returns plain text. `renderOption` optionally renders rich
  list and multi-select chip content; keep React elements out of the selected records.
- Selected records carry enough data to display before options load, and need
  not appear in the current options page. `staticOptions` remains available for
  actual fixed choices, not for injecting the current selection.
- Loaded records take precedence for displayed labels. Refreshing options never
  emits `onValueChange`. A user selection emits current loaded records, falling
  back to selected records whose IDs are absent from the loaded list.

Keep API entities, form values, and combobox options as separate contracts when
they contain different data. A saved response may provide only a summary,
while loaded options provide additional display metadata. Build form defaults
from the data actually available; do not invent missing metadata to satisfy an
option type. Represent unavailable display metadata explicitly in the combobox
contract.

When options contain fields that the form does not need, map selections at the
feature wrapper boundary:

```ts
type SelectionFormValue = {
  id: number;
  name: string;
};

type SelectionOption = {
  id: number;
  name: string;
  description?: string;
};

const toFormValue = (
  option: SelectionOption | null
): SelectionFormValue | null =>
  option ? { id: option.id, name: option.name } : null;
```

Use small serializable form records and normalize them to the endpoint's
expected IDs or commands before comparing or submitting. Display metadata
changes alone must not create PATCH fields. Form libraries may consider an
object with refreshed metadata dirty; use normalized payload comparison for
save/no-op decisions. Map backend ID-field errors back to the corresponding
object-valued form fields.

Default an empty single selection to `null` and an empty multiple selection to
`[]`. Retain nested data only when the workflow needs it, and reconcile dependent
selections when their available choices change. Serialize the IDs required by
the endpoint rather than sending entire option records.

If a fixed option represents clearing a relationship, map it to the form's empty
value at the wrapper boundary. Keep sentinel options out of request payloads;
apply the endpoint's omission or `null` rules during payload preparation.

A query key must identify both the requested dataset and the cached option
shape. Keep option caches under their resource invalidation prefix with a
distinct segment, such as `options`, to separate them from other query results.

## Refreshing Forms With Unsaved Changes

In `apps/store`, use `mergeFormValues` from
`src/lib/utils/form/comparison/mergeFormValues.ts` to compare the originally
loaded values, current edits, and latest saved values. It returns merged values,
conflicts, unresolved-choice status, and fields that differ from the saved defaults.
It does not depend on React, a form library, or a particular resource.

Define a typed `FormMergeFields<FormValues>` configuration in the feature with
each field's label, display formatter, and optional normalization function.
Independent edits merge automatically. Competing edits require a `local` or
`server` choice. Arrays are compared as complete values by default. A feature
can provide a field `merge` callback for a safe domain-specific merge; returning
`undefined` falls back to the standard comparison.

Import `FormConflictResolver` from `src/lib/components/FormConflictResolver`
and wrap the editor in `FormConflictResolver.Provider`. The provider owns the
refresh workflow and renders the saved-change notice and conflict choices.
Its private `useFormRefresh` hook and dialogs live
in the same module; consumers do not wire them individually.

Pass the accepted `baseline`, `latest` record, `onBaselineChange`, a form adapter,
and a typed `FormConflictPolicy<Record, FormValues>`. Keep the policy in the
feature: it supplies a numeric version getter, default-value mapper, merge
function, and notice copy. An optional `readOnly` configuration supplies its
predicate and notice copy. A read-only change shows a dismissible notice without
a refresh action, preserving unsaved edits and the accepted baseline. It also
replaces any open conflict choices. The shared module has no resource imports.

The form adapter provides reactive pristine/submitting flags, a getter for current
values, a reset function, and a field setter that restores edits without running
change listeners or validation. The refresh hook does not import TanStack Form or
Query. It accepts newer data automatically for pristine idle forms, defers
refreshes during submission, and preserves dirty edits when applying a refresh.
Cancelling any dialog retains the edits and submission baseline. Conflict choices
reset when the saved revision changes.

The conflict dialog uses TanStack Form to control its radio groups and handle
submission, with Zod validation requiring a local or saved choice for every
conflict. The same review shows current and proposed values for automatically
merged fields, supplied by the generic merge result's `updates`. Opening a review
never changes form values or the accepted baseline, including when there are no
conflicts. Users must select **Apply changes** to accept the preview; saving the
form remains a separate action. Its native form disables browser validation so
errors appear inline through the shared field-error helper. Apply stays enabled
for validation attempts; only a valid submission passes the choices to the
resolver. The component owning the form is keyed by saved revision so new data
clears selections and errors and refreshes the summary.

For structured values, configure `policy.fieldRenderers` by form field. Each
`FormFieldRenderer<Value>` receives that field's typed values: `renderUpdate`
gets the baseline, current, latest, and merged values; `renderChoice` gets the
local or saved value and returns a short radio label and separate display
content. Unconfigured fields retain the text comparison. The resolver owns
radio controls, required validation, revision resets, and applying choices;
feature renderers own presentation only. Keep tables and interactive disclosure
content outside radio labels, and do not parse the merge result's display strings.

The supply renderer displays products, SKUs, quantities, units, and formatted
unit prices in tables. Safe additions appear after saved rows and are identified
as retained local rows. Conflicts retain one choice per complete list. Saved row
IDs may change and duplicate products are valid, so this presentation does not
infer row additions, removals, or cell differences by SKU or array position.

Review instructions distinguish automatic updates, conflicting values, and
reviews containing both. Only reviews with conflicts ask the user to choose.
When no field values need review, the dialog says **No updates to review** and
requires **Use latest version** to accept the saved baseline. A note beside the
actions explains that accepting a review does not save edits; `policy.saveNotice`
can supply workflow-specific wording, such as not saving or finalizing a supply.
The primary button references this note as its accessible description.

Place `FormConflictResolver.ReviewButton` beside the form's submit actions. It
reads context directly and renders only when saved changes are pending. Use
the **Review updates** action in either the initial notice or footer to enter
the review directly. The footer does not repeat the initial notification.
Read-only updates continue to open the informational notice. Use
`FormConflictResolver.useContext()` to read `isReadOnly`, `hasPendingChanges`, or
`openReview` in descendants. Guard every submit path with `isReadOnly`, including
native form submission and confirmation actions. Shared create/edit forms may
render without a provider: the hook returns `null` and the review button renders
nothing. Each provider owns independent state.

Keep the accepted baseline in the feature so its submit hook and provider receive
the same record; pass its setter as `onBaselineChange`. This avoids a circular
dependency between form creation and the resolver. Keep request/cache side
effects in the feature's success callback, then reset the form to the saved
defaults and update the controlled baseline together. The provider clears
obsolete review state when that baseline's version changes without remounting
the editor. Mount a separate editor instance for each record identity, not each
revision, so review state cannot carry over to another record and unsaved edits
survive background updates.

## Form Hook Tests

Use the app-local `prepareFormHookTestSetup` helper when a hook test only needs
to submit the form and assert submit-side effects. Keep this helper in the app's
test utilities, such as `src/test/prepareFormHookTestSetup`.

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
