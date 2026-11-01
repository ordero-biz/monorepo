# Category selection during product creation

Product setup and the common product details editor use
[`ProductCategoryCombobox`](../../apps/store/src/features/products/shared/ProductCategoryCombobox/ProductCategoryCombobox.tsx)
in both creation routes. The resource-owned category combobox remains usable in
category-management workflows that permit draft selection.

## Selection and activation

- Active categories can be selected directly.
- Draft categories remain searchable and show a `Draft` badge.
- Attempting to select a draft opens a review without changing the form value or
  triggering its blur/change validation. Missing status also requires review.
- The review fetches current category details and displays its parent and name as
  a compact path with a Draft badge.
  On initial load, only the category path and badge use shared Skeleton
  placeholders. The known category name and Draft chip determine their own
  placeholder sizes through Skeleton children; the unknown parent name uses an
  approximate width. Their region matches one row on desktop and reserves a wrapped row on narrow
  screens; the explanation,
  permanent consequence, details link, and footer are already visible. Long
  content can still grow naturally. Background refresh retains loaded content
  and announces loading without inserting a visible status line.
  Confirmation is disabled during loading, after a failed read, or when status
  is unavailable. Failed reads offer retry.
- For a draft, `Activate and select` explicitly requests activation. The review
  explains that activation applies across the catalog, cannot be undone, and
  prevents further editing—even if product creation is cancelled.
- The category is selected only after the activation response confirms `ACTIVE`.
  Failures stay in the review with the previous selection intact. The server
  decides whether the user and category are eligible for activation.
- When fresh details already show `ACTIVE`, the action becomes `Select category`
  and performs no activation write.
- Cancel preserves the previous selection. Confirmation and dismissal are
  blocked while activation is pending to avoid losing an in-flight result.
- `View category details` offers a longer review. The open review refreshes
  stale details when window focus returns. A failed refresh offers `Try again`.
  External activation never automatically changes the product's selection.

The existing product validators also reject a category explicitly marked draft.
Legacy records may omit status; the selection control resolves that uncertainty
through the detail endpoint. This change does not add a fresh status request to
every product submission or replace backend enforcement.

## Data and cache ownership

The workflow reuses `getCategory`, `updateCategory`, and category query keys.
Successful activation seeds the exact detail cache and invalidates other
category representations, including selectors, lists, parent references, and
children collections. The selection uses the returned category details.

The permanent consequence is grouped in one compact notice. Cancel precedes
`Activate and select`; the details link remains a tertiary action.

Dialog focus behavior belongs to the shared Dialog component. The combobox
cancels the draft selection event before opening the review and suppresses the
resulting blur validation while the review is open.

## Coverage and scope

Behavior tests live in
[`ProductCategoryCombobox.test.tsx`](../../apps/store/src/features/products/shared/ProductCategoryCombobox/ProductCategoryCombobox.test.tsx).
They cover selection, cancellation and focus, loading failures, activation
failures and retry, missing status, external activation, pending requests, and
refreshing dropdown options. Product validation and both creation workflows
retain their integration coverage.

Attribute and attribute-value activation remain separate future increments.
There is no client permission or parent-status prerequisite inferred here; add
such checks only when the backend contract exposes them.
