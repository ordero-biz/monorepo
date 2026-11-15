# Temporary TODO: Application-wide form validation

The shared refactor was deferred during the product-creation redesign and is
tracked for a dedicated PR. Existing forms use the current error helpers
until they migrate.

## Findings from the original review

- The review found `submissionAttempts` in 27 Store source files, excluding
  tests. Categories, attributes, warehouses, products, and supplies repeat the
  visibility subscription. Refresh this snapshot before migration.
- Platform's error helper uses blur state and submit errors without the
  submission-attempt counter. Compare both helpers before consolidating them.
- `submissionAttempts` is legitimate form state. TanStack's
  `revalidateLogic` uses it internally. The duplication is in the visibility
  decisions made by individual presentation components.
- A local Product Details experiment moved validation timing into its form
  hook and let fields read their errors directly. It was rolled back to avoid
  introducing a one-off policy during the redesign.

## Target behavior

- For an ordinary required field, keep client errors hidden while the user
  first edits. Reveal them on first blur or a submit attempt, including when
  the user leaves the field empty.
- Once validation is visible, update it live as the user edits. A correction
  should clear the message and restore the field's valid state.
- A submit attempt should validate all applicable fields, including when the
  user presses Enter without blurring the focused field. Block the write when
  validation fails.
- Show backend field errors immediately and give them precedence while the
  rejected value is unchanged. Keep the error through focus and blur. Clear it
  on a relevant value change and continue live client validation, even before
  the first blur.
- Apply the rules for the action the user chose. Terms acceptance can stay
  submit-only. Supply finalization can require a product while Save Draft
  permits an empty product list.

## Implementation to evaluate

- [ ] Keep one current client validation result per ordinary field. The
  prototype used an `onChange` validator with a field blur listener that
  calls `fieldApi.validate('change')`. TanStack Form 1.29.1 also runs change
  validators during submit validation. Check the submit path when a known
  error already exists, since TanStack can exit before running the remaining
  validators.
- [ ] Evaluate TanStack's `revalidateLogic` for the shared implementation.
  Configuring blur before submit and change after submit covers two phases.
  Live correction after first blur or a backend error also needs to work
  before the first submit attempt.
- [ ] Consolidate error visibility and client/backend precedence in reusable
  app-side form code. Use the existing submission-attempt state where needed
  and keep the visibility logic out of individual field renderers. Normalize
  messages and resolve precedence explicitly, since `errors[0]` may represent
  a different source. Keep schemas, request mapping, product editor
  snapshots, and action-specific rules in each feature.
- [ ] Tie backend errors to the value and request that produced them. Verify
  that blur preserves them and that a response for an old value cannot attach
  its error to a newer edit. Coordinate product-editor specifics with the
  [product creation server errors TODO](product-creation-server-errors.md).
- [ ] Keep dependency-driven validation working. In Create Transfer, changing
  the source must revalidate the destination. Check array row identity,
  unmounted fields, async validation, and reset behavior before migrating
  forms that use them.

Two behaviors were reproduced against TanStack Form 1.29.1. Registering the
same rule for blur and change can leave a stale blur error after a valid edit.
The message can disappear while the invalid state still blocks submission. The
single-result prototype cleared both the message and the invalid state.
Separately, TanStack can clear a backend error stored in `onSubmit` on blur
alone. Cover both cases in the pilot.

## Migration and verification

- [ ] Pilot the shared policy in Create Transfer and Platform's Add Store.
  Use Transfer to verify first blur, live correction, and the dependent
  warehouse selector. Use Add Store to verify keyboard submission, untouched
  fields, and the next submission after correction.
- [ ] Verify backend error precedence, unchanged-value blur, edits made while
  a request is pending, and cleanup on cancel, reset, and reopen.
- [ ] Migrate the remaining form groups with focused component tests. Preserve
  draft and finalize behavior, submit-only controls, and intentional
  exceptions documented by the owning workflow.
- [ ] Update [the form conventions](../forms.md) and the
  `feature-form-architecture` skill once the pattern is settled. Remove this
  TODO after the migration.

## Starting points

- [Store error helper](../../apps/store/src/lib/utils/form/error/field.ts)
- [Platform error helper](../../apps/platform/src/lib/utils/form/error/field.ts)
- [Product Details editor](../../apps/store/src/features/products/add2/CreateProduct/ProductDetailsEditor.tsx)
- [Product Details form hook](../../apps/store/src/features/products/add2/CreateProduct/hooks/useProductDetailsForm.ts)
- [Create Transfer fields](../../apps/store/src/features/transfers/add/CreateTransfer/TransferInformation.tsx)
- [Add Store form](../../apps/platform/src/features/stores/add/AddStoreForm.tsx)
- [Supply submit workflow](../../apps/store/src/features/supplies/shared/SupplyEditorForm/hooks/useSubmitSupplyForm.ts)
