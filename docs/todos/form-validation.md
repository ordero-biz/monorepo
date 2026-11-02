# Temporary TODO: Application-wide form validation

Status: deferred until product creation is finished.

Keep the existing `submissionAttempts` subscription and
`getFieldSubmitChangeErrorText` approach in place for now. Revisit this note
after the product-creation redesign; remove it once the shared approach is
implemented and documented.

## Findings

- The review found `submissionAttempts` in 27 store source files, excluding
  tests. Categories, attributes, warehouses, product forms, and supply forms
  repeat the visibility subscription. These counts describe the investigation
  snapshot and should be refreshed before migration.
- Platform uses a different error-display helper without that counter. Review
  both implementations before deciding the shared scope.
- The counter is legitimate form state: TanStack's `revalidateLogic` uses it
  internally. The architectural concern is repeated validation-visibility
  decisions in presentation components.
- The product details experiment moved timing into its form hook and let
  fields read their errors directly. It was tested locally, then rolled back
  at the user's request to avoid introducing a one-off policy during the
  product-creation work.

## Proposed direction to evaluate

- [ ] Establish one reusable validation policy: validate on blur or submission,
  then update errors live once revealed; show service errors immediately.
- [ ] Build on TanStack's `revalidateLogic`. Blur before submission and change
  after submission alone does not cover live correction immediately after the
  first blur or a service error; address those transitions explicitly.
- [ ] Keep error normalization and service/client precedence in a shared
  helper. Do not assume `errors[0]` expresses the correct precedence for every
  form or error representation.
- [ ] Keep product-specific editing snapshots, unchanged rejected-value
  checks, request mapping, and workflow state outside the general policy.
- [ ] Review dependent fields, dynamic arrays, async validation, unmounted
  fields, and reset behavior before migrating existing consumers.
- [ ] Migrate incrementally and update `docs/forms.md` and the
  `feature-form-architecture` skill when the convention is settled.

## Behaviors to verify

- No client error appears on the first keystroke before blur or submission.
- Blur reveals errors; correction and subsequent invalid edits update live.
- Submission validates untouched fields, including keyboard submission without
  blur, and blocks invalid values.
- Service errors appear immediately, clear according to the chosen precedence
  policy, and continue to allow live validation after correction, even before
  the field's first blur.
- Cancel, reset, and reopen do not leak temporary edits or stale errors.
- Array changes, cross-field dependencies, async responses, and unmounted
  fields retain correct error ownership.

## Starting points

- [Current store error helper](../../apps/store/src/lib/utils/form/error/field.ts)
- [Current platform error helper](../../apps/platform/src/lib/utils/form/error/field.ts)
- [Product details editor](../../apps/store/src/features/products/add2/CreateProduct/ProductDetailsEditor.tsx)
- [Product details form hook](../../apps/store/src/features/products/add2/CreateProduct/hooks/useProductDetailsForm.ts)
- [Form conventions](../forms.md)
