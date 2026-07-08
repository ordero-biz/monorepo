---
name: feature-form-architecture
description: Use when creating, refactoring, or reviewing feature-owned form components in apps/platform or apps/store, especially when deciding how to split workflow containers, form components, form hooks, field sections, validation/default values, submit actions, backend error mapping, and post-submit side effects.
---

# Feature Form Architecture

Use this skill for feature-owned forms in app code. The goal is to make forms predictable by giving each layer one job: workflow shell, form component, form hook, field sections, and feature utilities.

## Recommended Shape

A feature form can start small, but split along these boundaries as soon as the component mixes several concerns:

```txt
FeatureFlow.tsx                  # Dialog/page/drawer workflow and side effects
FeatureForm.tsx                  # <form>, layout, submit event, field composition
hooks/useFeatureForm.ts          # form setup, submit orchestration, backend errors
FieldSection.tsx                 # repeated or dense field groups, arrays, row behavior
constants.ts                     # default values and static configuration
utils/validations.ts             # schemas and client validators
utils/submitAction.ts            # feature-owned request normalization and submit call
```

Keep the actual names domain-specific. A small page form can combine workflow,
form component, and hook duties while it remains easy to read. Extract a
separate hook, submit action, or field section when backend error mapping,
toasts, query invalidation, navigation, dialog reset, or dense field groups
start competing in one component.

## Responsibility Boundaries

### Workflow Shell

Own dialog, drawer, route, or page workflow:

- open/close state
- route navigation
- query invalidation or cache updates
- reset behavior tied to UI lifecycle, such as closing a dialog
- passing narrow success callbacks into the form layer

Do not hide workflow state inside a form hook just because the form submit eventually closes or navigates.

### Form Component

Own the form UI composition:

- the `<form>` element and submit event
- layout, sections, labels, buttons, and disabled states
- field components and field-section composition
- user-visible validation message placement
- connecting form fields to presentational `@ordero/ui` controls with ordinary controlled props

For labels in composed forms, follow `ui-routine-conventions`: use `Field.Label`
inside Base UI field context, use native `label` with `htmlFor` for explicit
control association outside that context, and avoid label semantics for section
headings or display-only text.

Keep shared UI components form-library agnostic. Do not move field logic into `packages/ui` when it depends on feature schemas, submit state, backend errors, or form-library state.

### Form Hook

A `useCreateXForm`, `useUpdateXForm`, or similar hook should own:

- form initialization and default values
- submit orchestration for that form
- calling the feature-owned submit action or request helper
- mapping backend field errors back into the form
- showing form-level submit errors through the shared toast surface
- invoking a caller-provided success callback with the smallest useful result, such as an id

The form hook should not own:

- dialog, drawer, popover, or page open state
- route navigation or redirect details
- query invalidation or cache updates unless the hook is explicitly a server-state integration hook
- field-array row factories, local row ids, add/remove button behavior, or section layout
- field JSX, labels, adornments, icons, or validation message rendering
- cross-feature abstractions before the pattern appears in several real forms

### Field Sections

Extract dense or repeated field groups into local components or field-section hooks when they have cohesive UI behavior:

- dynamic arrays and row ids
- add/remove/reorder behavior
- repeated adornments or grouped controls
- section-specific validation display

Keep this logic near the field section, not in the main form hook. For example, an attribute-values row factory should move with an `AttributeValuesField`, not into `useCreateAttributeForm`.

### Combobox Fields

Use `Select` for short, fixed option sets where search is not needed. Use
`Combobox` when the field needs searchable options, textbox-style filtering, or
multiple selection with chips.

For form-owned combobox fields:

- wire fields through ordinary controlled props: `value`, `onValueChange`,
  `name`, `onBlur`, `invalid`, and `errorText`
- use `value: string | null` for single selection and `value: string[]` with
  `multiple={true}` for multiple selection
- keep shared `@ordero/ui` comboboxes presentational and form-library agnostic
- cover behavior in tests by opening the combobox by role and selecting options
  by role/name; do not assert variant classes or private DOM structure

For request-backed option lists, create a feature-owned or app-owned resource
wrapper such as `CategoriesAsyncCombobox` instead of putting request/query logic
directly in the form markup. The wrapper should own the request helper, option
mapping, page size, sorting/filtering, loading/error copy, and `queryKey`.

Anchor async combobox query keys under the same resource query prefix used for
invalidation, then add a component-specific segment so list-page data and option
data do not collide. Include request parameters that can vary, such as page
size, filters, or sort, in the key. This keeps broad invalidations such as
`invalidateQueries({ queryKey: categoriesQueryKeys.list })` refreshing related
option caches after writes.

When a wrapper keeps explicit prop forwarding, forward every retained
`Combobox` prop intentionally, including visual props like `variant` and
accessibility props like `aria-describedby`, `aria-label`, and
`aria-labelledby`.

## Success Callbacks

Pass post-submit workflow behavior into the form hook:

```ts
const { form } = useCreateAttributeForm({
  onCreated: async (attributeId) => {
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey: attributesQueryKeys.list,
    });
    router.push(getAttributeDetailRoute(attributeId));
  },
});
```

Use callback names that describe the feature result:

- `onCreated` for create forms that return a new entity id
- `onUpdated` for update forms
- `onSuccess` only when the result is intentionally generic

Return only what consumers need. Prefer `return { form }` until another returned value has a clear feature-owned reason.

## Splitting Workflow

1. Identify which concern is making the component hard to read: workflow, form setup, submit, field rendering, or field-array behavior.
2. Move form setup, submit action calls, backend field-error mapping, and submit toasts into a feature form hook.
3. Keep form markup and field composition in a form component or the current workflow component.
4. Keep navigation, cache invalidation, dialog close, and UI-lifecycle reset at the workflow layer.
5. Move dense field groups or arrays into local field-section components when they become independently readable units.
6. Keep validation schemas, field validators, defaults, and submit normalization feature-owned.

## Error And Validation UX

Follow `docs/forms.md` for validation visibility and backend error precedence:

- do not show client validation errors on the first keystroke
- show client validation errors after blur
- once a field has been revealed as invalid, update validity live while the user corrects it
- show submit or backend field errors even if the field was never blurred
- map backend field errors in the feature layer
- show form-level errors through the shared toast surface

Use shared form error helpers when repeated submit/change precedence logic appears across fields.

## Testing And Checks

Cover user-visible form behavior with component tests: validation timing, disabled states, submit/reset behavior, backend field errors, and visible toast/form errors.

For tests that focus on form-hook submit behavior rather than field rendering,
use the app-local generic form-hook setup helper instead of creating a one-off
test component for each hook. In both `apps/platform` and `apps/store`, import
`prepareFormHookTestSetup` from `@/test/prepareFormHookTestSetup`. Use it to
render a submit-only form, mock the feature submit action, and assert
hook-specific behavior such as calling `onCreated`, not calling success
callbacks on failure, and showing submit-error toasts.

Do not add fields, labels, custom submit text, or feature-specific fixture components to a form-hook test unless that test is intentionally covering field UI behavior. Put field rendering, accessible labels, visible validation messages, and field-array interactions in the feature form/component tests.

After refactoring a feature form, run the smallest useful checks for the app, usually:

```sh
node_modules/.bin/biome check <touched files>
node_modules/.bin/tsc --noEmit
node_modules/.bin/vitest run <focused form test>
```

Use the app-local binaries from the app directory when `pnpm --dir ...` is blocked by the sandbox.
