# Product Generation Business Rules and UX Decisions

Status: accepted behavior for the current incremental redesign, with limitations
listed below. Updated: 2026-11-02.

Product creation helps store operators prepare **one product with one or more
variants**. It separates choosing shared details and variant combinations from
reviewing the generated variants and entering their identifiers.

This specification covers the redesigned `/products/add2` workflow. It reuses
generation, validation, and submission logic from the original `/products/add`
implementation. The original route still exists; its presentation is not the
reference for this document. This is a record of current behavior and product
decisions, not a claim that the redesign is complete.

## Product, variant, and attribute value

| Term | Meaning in this workflow |
| --- | --- |
| Product | The shared record with a name, category, description, status, and collection of variants. The API calls this a product group. |
| Product variant | An individual entry with its own name, SKU, barcode, status, description, and selected attribute value IDs. |
| Attribute | A dimension such as Origin or Grind. |
| Attribute value | A choice such as Brazil or Whole bean. Its catalog status is separate from the generated variant's status. |
| Generation | Preparing editable variant records in the browser. It does not save a product. |
| Creation | Submitting the product and all its variants to the service. |

Both generation modes create one product. **Multiple variants** never means
multiple independent products. A variant count describes the planned output;
it does not establish that required fields are complete or that anything is saved.

## Two-step flow

### 1. Product setup

1. Enter the product name and select a category. Both are required and appear
   side by side on wider screens. Below them, the optional Description has a
   taller, non-resizable textarea beside **Status after creation** (Draft by
   default). The fields stack on narrower screens.
2. Choose **Single variant** or **Multiple variants**. Single variant is the
   default.
3. Use **Add attribute** to select an attribute, then choose its values. Setup
   permits multiple values per attribute in either mode. Already added attributes
   cannot be added again. Removing an attribute also removes its value selections.
4. Review the live **Variant summary**. It explains the count and that all variants
   belong to one product. In single mode, selecting multiple values adds an
   explanation that they will stay together in one variant.
5. Press **Review variants**. Invalid setup stays on step 1 with field errors.
   Valid setup generates the variants locally and moves to **Review & create**.

Changing the mode changes how the existing selections will be interpreted; it
does not clear them. Adding an attribute focuses its values control and scrolls
the **Add attribute** button into view after the new row renders. Adding
or removing attributes is announced to assistive technology. Cancelling the add
control leaves existing selections intact.

### 2. Review & create

1. Review the labelled **Product details** summary.
2. If needed, use **Edit details**, then **Apply changes** or **Cancel**.
3. Enter each variant's name, SKU, barcode, and status directly in the table.
4. Use **Show details** for attributes and description. The image area is currently
   a placeholder, not an upload flow.
5. Press **Create product**. The complete product configuration is validated,
   including variants that have not yet been rendered on screen.
6. On success, show a creation notification, reset the form, refresh product and
   variant lists, and navigate to the products list.

There is currently no in-flow Back or regenerate action. Step 2 supports editing
the generated records, not rebuilding the combination set. Form values are held
in memory; there is no saved setup draft or reload recovery.

## Generation rules

| Rule | Single variant | Multiple variants |
| --- | --- | --- |
| Output | Exactly one variant. | One variant for every combination of selected values. |
| Attributes required | No. | At least one attribute and at least one selected value overall. |
| Multiple values of one attribute | Kept together on the one variant. | Produce separate combinations. |
| Attribute with no selected values | Contributes nothing to the variant. | Omitted from the combination calculation; it does not make the count zero. |
| No selected values anywhere | One variant with no attribute values. | Cannot continue. |
| Limit | One variant. | Up to 500 generated variants. |

For example, a product named **Coffee** with Origin values **Brazil**, **Ethiopia**
and Grind values **Whole bean**, **Filter** produces:

- In single mode: one variant containing all four values.
- In multiple mode: four variants — Brazil / Whole bean, Brazil / Filter,
  Ethiopia / Whole bean, and Ethiopia / Filter.

Multiple mode uses a Cartesian product of non-empty value selections. It can
produce just one variant when only one combination is selected. An unselected
attribute does not require a value merely because it was added to setup.

At more than 500 combinations, the summary displays **More than 500 variants**
and asks the user to select fewer values. **Review variants** is disabled. The
generation validator also enforces the limit; exactly 500 is allowed.

Names begin with the trimmed product name followed by selected value names,
separated by spaces. Attribute order follows setup order; values follow their
order in the attribute's available values, rather than selection-click order.
For example: **Coffee Brazil Whole bean**. Names remain editable in review.

## Defaults and data ownership

| Field | Generated/default value | Behavior after generation |
| --- | --- | --- |
| Product name and category | Copied from setup. | Edited through the shared details editor. |
| Product description | Copied from setup. | Independent of each generated variant's description. |
| Product status | Copied from setup; defaults to Draft. | Can be changed in the shared details editor. |
| Variant name | Product name plus selected value names. | Editable directly; not regenerated when shared details or attributes change. |
| Variant description | Copy of the setup description. | Edited independently in expanded details. |
| Variant SKU and barcode | Empty strings. | User must fill both before creation. |
| Variant status | Draft. | Active is available only under an Active product. Applying Draft to the product explicitly confirms changing its Active variants to Draft. |
| Variant attributes | Selected value IDs for that variant. | Can be changed independently of other variants. |
| Images | No stored value. | Current image controls are visual placeholders and are absent from the submission payload. |

Shared details are a starting point for generation, not a continuing inheritance
relationship. Applying a new product name or description must not overwrite
variant edits. No automatic name update occurs after editing variant attributes.

### Product and variant status dependency

Draft is for saving a product for further editing without using it in supplies
or sales. Active allows its Active variants to be supplied and sold; Draft variants remain unavailable
and can be activated later. Explain this purpose before the dependency rules.

A Draft product can contain only Draft variants. An Active product can contain
Draft variants, Active variants, or a mix; all-Draft variants are also allowed.
Both statuses remain unsaved choices until **Create product**. Changing these
choices does not use the permanent catalog activation dialog.

Product status is selected in step 1 and carried into review. Generated variants
remain Draft even when the product is Active; individual variant statuses are
chosen in step 2. The setup Active option explains this next step.

The review editor radio descriptions explain the purpose and relationship:

- **Draft:** “Save for further editing. The product cannot be supplied or sold,
  and all variants must remain Draft.”
- **Active:** “Allow active variants to be supplied and sold. Draft variants
  remain unavailable and can be activated later.”

The read summary labels the value **Product status after creation**, with
“Cannot be supplied or sold. All variants must remain Draft.” or “Only active
variants can be supplied and sold.” **Edit details** opens the existing inline editor.

Under a Draft product, Active remains visible but disabled in each variant dropdown.
Its description reads “Product is Draft. Change its status in Product details.”
This explanation appears beside the restricted option, with no extra action in the
list or repeated restriction above the table. Under an Active product, the option
is enabled and its restriction description is removed. The table introduction
explains that Active variants can be supplied and sold and Draft variants cannot.

| Product status change | Behavior |
| --- | --- |
| Draft → Active | Applying enables Active in variant controls; existing variant choices stay unchanged. |
| Active → Draft, no Active variants | Apply normally without additional confirmation. |
| Active → Draft, some Active variants | Show the affected count and change the editor action to **Apply and set N variants to Draft**. |

Selecting the Draft radio alone does not change variant values. Only a valid
Apply changes the product and affected variants together, including variants not
yet rendered. Cancel preserves the previous values. Switching the radio back to
Active removes the notice and restores **Apply changes**. Other variant fields
remain untouched. Final configuration validation also rejects Active variants
under a Draft product, including collapsed or not-yet-rendered rows.

The table restriction and inline confirmation belong to the redesigned route;
both routes share final validation. Availability descriptions express status
eligibility; they do not promise stock availability or automatic storefront
publishing, which depend on further service rules.

## Applying edits and saving

| Action | Scope | Persists to the service? |
| --- | --- | --- |
| Review variants | Generates the local variant collection. | No. |
| Apply changes in shared details | Validates and copies shared fields; when explicitly confirmed, also sets Active variants to Draft. | No. |
| Edit a table field | Updates that variant in the creation form. | No. |
| Apply changes in the attributes dialog | Copies the local attribute selection into the edited variant. | No. |
| Activate and select a draft catalog entity | Activates the category, attribute, or attribute value, then selects it. | Yes, immediately and across the catalog. |
| Create product | Submits the product and the full variant collection. | Yes, on successful service response. |

### Shared details editor

The inline editor replaces the summary rather than appending a second copy of
the fields. It starts with a snapshot of the applied values. **Apply changes**
validates that editor and stays open if invalid. **Cancel** discards its local
edits and editor errors without changing the applied product or variants.

Errors belong inside the editor, not in the read summary. A final client-side
validation failure affecting shared details opens the editor. Initial focus
prefers an invalid field; otherwise it goes to the first focusable control.
Leaving the editor restores focus to **Edit details**. **Create product** is
disabled while shared details are being edited, preventing submission of older
applied values while newer changes are still visible.

### Variant attributes dialog

The dialog identifies the variant and states that changes apply only to it. The
user can add attributes absent from setup, remove original attributes, and change
or clear values. Single-generation mode permits multiple values per attribute;
multiple-generation mode permits one value per attribute in this editor.

Changes stay local until **Apply changes**. Cancel discards them. Applying does
not rename the variant, regenerate siblings, change the row count, or trigger
whole-product validation. It also does not clear existing validation errors as a
side effect. Those messages are reconsidered by a later normal validation event,
such as **Create product**.

The dialog does not enforce a valid final combination on Apply. In multiple mode,
an empty selection shows the local **Select at least one attribute value** message
in the expanded row; missing or duplicate combinations block final creation.
Removing a value chip directly in the row is a normal form change, distinct from
applying the dialog snapshot.

## Selecting draft catalog entities

The [catalog lifecycle rules](catalog-lifecycle.md) define status meaning,
activation prerequisites, and permanent edit restrictions. This section defines
how product creation presents and applies those rules.

### Selection and review flow

1. Keep Draft categories, attributes, and values searchable with a **Draft**
   badge. Hiding them would make a known catalog record appear to be missing.
2. Select Active entries directly. Attempting to add a Draft or unknown-status
   entry opens review without changing the current selection or triggering the
   field's blur/change validation.
3. Load current data and identify the entity being reviewed. Show a category's
   parent and name, an attribute's name, or the attribute and value together.
4. Explain the entity-specific permanent consequence in one compact notice.
   Keep **Cancel** before **Activate and select**; offer a tertiary details link
   with an external-link icon that opens management in a new tab. Value review
   links to its parent attribute's details.
5. **Activate and select** requests activation and selects only after the response
   confirms Active. A review that finds the entity already Active offers a
   selection action instead, without another activation write.
6. Cancel leaves the existing selection intact and restores focus. While activation
   is pending, prevent duplicate confirmation and dismissal so the result is not lost.

Returning from the management tab refreshes the review. External activation does
not automatically select anything; the user still confirms selection. This gives
users a way to inspect more context while keeping the product form in place.

### Loading, eligibility, and failures

| Review | Data needed before confirmation |
| --- | --- |
| Category | Current category details, including a known status. |
| Attribute | Current attribute details and its values, with both reads successful. |
| Attribute value | Current parent attribute and its values; the chosen value must still exist, its status must be known, and the parent must be Active. |

A Draft parent blocks value confirmation and directs the user to attribute
management; the review never activates the parent implicitly. Do not infer an
equivalent parent-category requirement without a service contract.

Use Skeleton placeholders only for metadata awaiting fresh data. Known names and
badges size their placeholders through content; unknown information can use an
approximate size. Keep the explanation, notice, details link, and actions visible
to reduce layout movement. Allow long names to wrap naturally. Background refresh
retains loaded content, and loading is announced to screen readers.

Disable confirmation while checking data, after a failed read, or when status is
unavailable. Failed reads offer retry. A missing value explains that it is no
longer available. Activation errors remain inline with the review open and the
previous selection unchanged, allowing another attempt.

### Selection scope and nested editing

Single selection replaces the previous value only after confirmation. Multiple
selection adds the confirmed entry while preserving existing choices. Removing
an attribute or clearing a value never requires activation. Already added
attributes remain disabled in add controls.

Use the reviewed names and statuses when selecting records. Refreshing catalog
data can update existing option labels and statuses, but must not automatically
add new attributes or values to the product configuration. The attribute editor
keeps these selection changes local until its own **Apply changes**.

The shared Dialog owns focus, including when a review opens inside the variant
attribute editor. Closing or confirming the review must not apply or close the
parent editor. Catalog activation is already persisted even if the user later
cancels that editor; the review notice must make this distinction clear.

### Implementation scope

Shared resource selectors live under their category or attribute feature and
support workflows that permit Draft selection. Product-specific review wrappers
live under `products/shared` and apply the rules above.

Category and attribute review are used in both creation routes. Value review is
used in redesigned setup and in the variant attribute editor, supporting single
and multiple selection. The legacy setup's value toggle controls have not been
migrated. Existing validators reject an explicitly Draft category, while legacy
category records may omit status. Selection review resolves unknown status; it
does not add fresh status requests to every final submission or replace service
enforcement.

## Validation and request outcomes

| Check | Current rule |
| --- | --- |
| Shared product details | Non-blank name, selected category, and supported Draft or Active status. An explicitly Draft category is rejected. |
| Variant name | Required after trimming whitespace. Duplicate names are allowed by the current client validator. |
| SKU and barcode | Required after trimming; each must be unique across the submitted variants. Every conflicting row receives an error. Comparison is case-sensitive. |
| Variant status | Must be Draft or Active. Active is invalid when the product is Draft. |
| Attribute values | At least one per variant in multiple mode; optional in single mode. Non-empty value sets must be unique across variants, ignoring ID order and repeated IDs. |
| Description | Optional for the product and each variant. |
| Validation scope | All variant values, including collapsed and not-yet-rendered rows. |

Setup and editor fields reveal required errors on blur or submission and update
them during correction. Final validation runs again because values can change
after generation. An earlier successful setup or Apply is not a substitute for
checking the current configuration.

On a failed creation attempt, rows with errors in hidden detail fields open;
errors confined to name, SKU, or barcode do not expand a row. Already open rows
stay open. Later-rendered rows retain errors from the same submission. There is
no automatic scrolling when the user opens details.

While the creation request runs, the action reads **Creating product...** and is
disabled. Submission trims product and variant names, SKUs, barcodes, and
descriptions. Blank descriptions are omitted. The payload contains the category
ID, product fields, and every variant with its attribute value IDs.

A service failure keeps the review and entered values available. The existing
general error toast and legacy field-error mapping remain. A complete policy for
server errors on unmounted shared fields, editor reopening, and error clearing is
explicitly deferred; do not assume all server errors follow the client-validation
flow. See [product creation server errors](../todos/product-creation-server-errors.md).
Catalog-wide identifier uniqueness and final eligibility remain server concerns;
client checks only compare the variants in this form and do not re-fetch every
selected entity's status on submission.

## UX decisions and rationale

| Decision | Rationale |
| --- | --- |
| Separate setup from review and creation. | Let users understand the combinations before entering identifiers for each variant. |
| Show a live count and one-product context. | Make the effect of value selections visible and avoid confusing variants with separate products. |
| Label name, category, description, and status explicitly in the summary. | Values alone can be ambiguous, especially when product and category names resemble each other. |
| Keep name, category, and status together; place description beside them on wider screens. | Avoid gaps caused by unrelated content heights and give longer descriptions their own space. |
| Use **Status after creation** and neutral status text. | Avoid suggesting an unsaved product is already active. |
| Explain the Draft restriction once above the table and disable its Active options. | Prevent invalid choices and provide a direct route to change product status without repeating a message on every row. |
| Confirm affected variants in the existing inline editor before applying Draft. | Make the scope explicit without silently overwriting variant choices or adding another dialog. |
| Use an inline editor for shared details and a dialog for variant attributes. | Keep product context visible while giving attribute additions and removals a bounded Apply/Cancel flow. |
| Keep variant name, SKU, barcode, and status visible in table columns. | Support comparison and completion of the frequent per-variant fields without opening every row. |
| Use a labelled **Show details / Hide details** button with a chevron. Start all rows closed. | Make expansion discoverable without forcing a large first row open. The button column fits its content. |
| Allow several rows to be open and separate expanded groups with a narrow gap interrupting the green edge. | Support comparison while making sibling boundaries visible. Keep the content background neutral. |
| Use fixed-height, non-resizable description textareas. | Preserve a predictable expanded-row layout. |
| Put the variants heading and instructions in the DataTable top section. | Keep collection context outside the scrolling table body. |
| Use **You’re creating 1 product with N variants** in the action bar. | Explain the result of submission without falsely declaring incomplete variants “ready.” |
| Reuse combobox selection patterns in setup and the attribute editor. | Reduce the number of interaction patterns users must learn. |

## Large collections and accessibility

The table initially renders up to 20 variants and appends rows in batches of 20
as the user approaches the end. Generation, counts, validation, and submission
still cover the entire collection. This is incremental rendering of local data,
not server pagination; existing rows are retained so their focus and edits survive
when more rows appear. Without IntersectionObserver, all rows render.

Collapsed detail content mounts when opened and unmounts when closed. Values
remain in the form and must survive reopening. Row order is fixed; there is no
row deletion or reordering in this step. The shared table supplies semantic detail
rows, expanded state, and toggle labels identifying the variant.

Inline editor focus uses the shared [accessibility focus hooks](../accessibility-focus.md).
The shared Dialog owns modal focus, including nested draft reviews; closing a
review must not apply or close the parent attribute editor. Narrow layouts stack
field groups; the table retains its column minimum widths and horizontal scrolling.
This does not establish complete mobile usability for the surrounding app shell.

## Limitations and future decisions

- **Images:** setup copy mentions shared photos, but upload, preview, persistence,
  and inheritance are not implemented. Treat the visible image areas as unfinished.
- **Batch editing:** not implemented. Define selected-row scope and overwrite rules
  before adding it.
- **Returning to setup:** no back/regenerate flow or merge policy for preserving
  manual edits. Define those rules before exposing regeneration.
- **Recovery:** no autosave or persisted creation draft. Draft status is a status
  to save on creation, not evidence of an existing saved record.
- **Availability:** the product/variant status dependency is defined above;
  confirm any further service rules before promising storefront visibility or
  availability in a particular supply or sale.
- **Validation architecture:** the existing submission-attempt visibility mechanism
  remains temporarily. Follow the [application-wide validation TODO](../todos/form-validation.md)
  after the product creation work rather than introducing a separate policy here.
- **Server errors:** complete the deferred server-error contract before promising
  automatic recovery for every rejected field.
- **Legacy parity and cleanup:** decide when the new route replaces the old one,
  migrate remaining selectors, and consolidate the incremental composition.

## Evidence and implementation references

These decisions come from the incremental product-creation design discussions and
the implementation inspected on 2026-11-02. They are product decisions, not
findings from usability testing. Existing behavior tests provide regression
coverage; this documentation change does not represent a new test run.

- [Redesigned workflow](../../apps/store/src/features/products/add2/CreateProduct/CreateProduct.tsx)
  composes the two steps and opens shared editing for client errors.
- [Generation rules](../../apps/store/src/features/products/add/CreateProduct/utils/productGeneration.ts)
  and [generation tests](../../apps/store/src/features/products/add/CreateProduct/utils/productGeneration.test.ts)
  define combinations, names, and copied values.
- [Validation rules](../../apps/store/src/features/products/add/CreateProduct/utils/validations.ts)
  and [validation tests](../../apps/store/src/features/products/add/CreateProduct/utils/validations.test.ts)
  cover required fields, limits, and duplicates.
- [Workflow tests](../../apps/store/src/features/products/add2/CreateProduct/CreateProduct.test.tsx)
  cover generation modes, shared editing, cancellation, attribute changes, and submission.
- [Variant table tests](../../apps/store/src/features/products/add2/CreateProduct/ProductVariantsTable.test.tsx)
  cover hidden-error expansion, applying attributes without validation, incremental
  rendering, retained focus, and submission of the full collection.
- [Attribute editor tests](../../apps/store/src/features/products/add/CreateProduct/EditProductVariantAttributesDialog.test.tsx)
  cover local selection and nested activation reviews.
- [Category review tests](../../apps/store/src/features/products/shared/ProductCategoryCombobox/ProductCategoryCombobox.test.tsx),
  [attribute review tests](../../apps/store/src/features/products/shared/ProductAttributesCombobox/ProductAttributesCombobox.test.tsx),
  and [value review tests](../../apps/store/src/features/products/shared/ProductAttributeValuesCombobox/ProductAttributeValuesCombobox.test.tsx)
  cover selection, cancellation, focus, loading and activation failures, pending
  requests, external activation, and refreshed options. Value review also covers
  parent prerequisites, missing values, and reuse of reviewed statuses.
- [Submission mapping](../../apps/store/src/features/products/add/CreateProduct/utils/submitAction.ts)
  and [submission tests](../../apps/store/src/features/products/add/CreateProduct/utils/submitAction.test.ts)
  cover payload normalization and service errors.
- [Shared DataTable documentation](../data-tables.md) and [form conventions](../forms.md)
  describe reusable implementation contracts.

## Keeping this specification current

Update this document with changes to generation rules, defaults, validation,
editing scope, persistence, or navigation in the same change as the implementation
and relevant tests. Keep accepted behavior separate from future decisions. Maintain
shared status and activation rules in the catalog lifecycle document and reusable
implementation conventions in the shared guides.
