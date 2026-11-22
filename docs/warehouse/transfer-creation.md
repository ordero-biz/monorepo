# Transfer Creation Business Rules and UX Decisions

Status: accepted behavior for the current implementation, with limitations
listed below. Updated: 2026-11-17.

A transfer moves stock from one warehouse (the **source**) to another warehouse
(the **destination**). The create-transfer page helps store operators prepare
that movement: choose both warehouses, then build the list of stock lines and
quantities to move.

This specification covers the `/warehouse/transfers/add` page, from choosing
the warehouses to creating the transfer. A saved Draft opens at
`/warehouse/transfers/{id}` in the same editor, including the source warehouse change
confirmation; rows restored from the draft show Available as "—" until the stock
line is picked again. Other statuses have no detail view yet.

## Terms

| Term | Meaning in this workflow |
| --- | --- |
| Source warehouse | The **From warehouse**. Products are picked from its current stock. |
| Destination warehouse | The **To warehouse** that will receive the products. It must differ from the source. |
| Stock line | One product variant in one unit of measurement held in the source warehouse. The same variant in two units is two stock lines. |
| Transfer entry | One table row: a stock line, the quantity to transfer, and an optional comment. |
| Available | The stock line's quantity in the source warehouse when the picker loaded it. |

## Entry points

- **Warehouse detail → ⋮ → Create transfer** opens the page with that warehouse
  as the source (`?sourceWarehouseId={id}`). The item is shown only for Active
  warehouses.
- Opening `/warehouse/transfers/add` without the parameter starts with an empty
  source.
- An invalid or non-positive `sourceWarehouseId` is ignored.

### Source warehouse from the URL

| Situation | Behavior |
| --- | --- |
| Active warehouse | Preselected as the source. The breadcrumb shows it between Warehouses and New transfer. |
| Draft warehouse | Opens the **Publish warehouse?** review. Publishing selects it; Cancel leaves the source empty and returns focus to From warehouse. |
| Warehouse cannot be loaded | Shows a **Choose a source warehouse** notice and leaves the source empty for manual selection. |

The breadcrumb reflects the warehouse the page was opened from. Changing the
source in the form does not rewrite the URL or the breadcrumb.

## Transfer information

| Field | Rule |
| --- | --- |
| Name | Required, trimmed, at most 100 characters. |
| From warehouse | Required. Choosing a Draft warehouse opens the publish review before it can be selected. |
| To warehouse | Required. The source warehouse is disabled in its options; a destination equal to the source is rejected. Draft warehouses go through the same publish review. |
| Comment | Optional note for the receiving warehouse. |

Publishing from the review is permanent and changes the shared warehouse
record, even if the transfer is abandoned. It follows the same principle as
[catalog entity activation](../product/catalog-lifecycle.md).

## Products to transfer

The **Products to transfer** table has the columns Product, Unit, Available,
Quantity to transfer, and Comment, plus a row actions menu with **Delete**.

### Picking stock lines

- The Product picker is disabled with **Select a source warehouse first** until
  a source is chosen.
- Options are the source warehouse's stock lines in the backend's default order.
  Lines with zero or negative quantity are not offered.
- Each option shows the product name, SKU, and "{available} {unit} in stock".
- A stock line already used in another row is disabled, so one stock line
  appears at most once per transfer.
- Picking a line fills **Unit** and **Available**. They are read-only.

### Quantity

- The quantity is a whole number greater than 0 and at most Available.
- The input's **Use all available** icon button sets the quantity to Available.
  It appears only after a stock line is picked and is disabled when the
  quantity already equals Available.
- There is no bulk "fill all" action. Row selection is used only for deletion.

### Rows

- The table always has at least one row. A fully empty row is a placeholder and
  is ignored by validation.
- **+ Add another product** adds a row. It is disabled while the last row has
  no stock line, so empty rows do not pile up.
- Selected rows can be deleted from the bulk action bar. Deleting every row
  leaves one empty placeholder.

### Changing the source warehouse

Entries are lines of the source warehouse's stock, so they cannot survive a
source change.

| Situation | Behavior |
| --- | --- |
| No row has a stock line | The source changes immediately. |
| At least one stock line is picked | The **Change source warehouse?** modal opens. Confirming changes the source and replaces all rows with one empty row. Cancel or Escape keeps both. |
| Source is cleared | Same as above, worded as **Clear source warehouse?**. |

The modal does not state how many products will be removed; it says that the
products will be removed from this transfer.

## Summary bar

Without a row selection, the bottom bar shows "{N} products · {N} units". It
counts only complete rows: a stock line with a valid quantity within Available.
With a selection, it shows the selected count, **Clear selection**, and
**Delete**.

Units are summed across rows even when units of measurement differ. The figure
is a rough size indicator, not a quantity in one unit.

## Saving

The bottom bar offers two actions while no rows are selected:

| Action | Result |
| --- | --- |
| **Save draft** | Creates the transfer with status Draft. Stock does not move. |
| **Transfer** | Opens the **Start transfer** confirmation. **Start transfer** validates the form and creates the transfer with status In Transit; Cancel keeps the form unchanged. |

Both actions send `POST /api/v1/warehouse-transfers` with the warehouses, the
trimmed name, the comment when not empty, and the non-empty rows
(`productVariantId`, `unitOfMeasurementId`, `quantity`, and the row comment
when not empty).

- Both actions run the same validation when the form is submitted: right away
  for **Save draft**, after **Start transfer** for **Transfer**. Buttons stay
  enabled; invalid fields show their errors after the attempt, and nothing is
  sent.
- **Transfer** requires at least one product. Without one, **Start transfer**
  shows **Add at least one product before transferring.** and sends nothing. A
  draft may be saved without products.
- The confirmation states that the transfer will be marked as "In transit" and
  that its products will be unavailable for stock operations (such as selling,
  moving, or counting) until the transfer is completed.
- While a request is pending, the form is disabled and the pressed action
  shows **Saving...** or **Transferring...**.
- On success, a toast confirms the result (**Transfer draft created.** or
  **Transfer started. Products are in transit.**). A draft opens its transfer
  detail page; after **Transfer** the page returns to the source warehouse
  detail, and the stock and warehouse details of both warehouses are refreshed.
- On failure, the service message is shown in a toast and field errors are
  attached to their fields. Row errors are matched to the row that was
  submitted, even if rows were removed or reordered since; errors for rows that
  no longer exist are dropped.

## Validation

| Field | Message |
| --- | --- |
| Name | Name is required / Name must be 100 characters or less |
| From warehouse | Select a source warehouse |
| To warehouse | Select a destination warehouse / Destination must differ from the source warehouse |
| Product (non-empty row) | Select a product |
| Quantity (non-empty row) | Quantity is required / Quantity must be a whole number greater than 0 / Only {available} available |

Errors appear after the field is blurred or after a submit attempt, following
the shared [form conventions](../forms.md).

## UX decisions and rationale

| Decision | Rationale |
| --- | --- |
| Pick stock lines from the source warehouse instead of the product catalog. | Only stock that exists in the source can be moved, and the line carries its unit and Available amount. |
| Hide zero-stock lines in the picker. | They cannot be transferred and would only add noise. |
| Disable duplicate stock lines instead of merging rows. | One row per stock line keeps the Available limit unambiguous. |
| Ask before a source change removes picked products. | The change is destructive and easy to trigger by accident in a combobox. |
| Put the "use all available" action inside the quantity input. | Filling the maximum is a per-row decision; a bulk action through checkboxes was harder to discover and mixed selection with editing. |
| Keep the Quantity column narrow (160px). | The value is short; the extra width is more useful for the product name. |
| Show the summary only for complete rows. | Invalid or partial rows would make the totals misleading. |
| Confirm before **Transfer** but not before **Save draft**. | Products in transit are unavailable for stock operations; a draft does not affect stock. |
| Allow drafts without products. | A draft records the plan before its contents are known. |

## Limitations and future decisions

- **Transfer detail** exists only for Drafts. In transit and Completed
  transfers have no detail view yet, so starting a transfer returns to the
  source warehouse.
- **Transfers list** (`/warehouse/transfers`) has no status filter yet.
- **Completing a transfer** (status Completed) is not part of this workflow.
- **Available is a snapshot.** It is not refreshed while the page is open; the
  backend must make the final stock check when saving.
- **Stock picker search and sorting** are not available; options use the
  backend's default order.
- **Mixed units in the summary** are summed as plain numbers. A per-unit
  breakdown would need an explicit product decision.
- **Mobile layout:** the table scrolls horizontally on narrow screens; a
  dedicated mobile layout is not designed.

## Evidence and implementation references

These decisions come from the transfer design discussions and the
implementation inspected on 2026-11-17. They are product decisions, not
findings from usability testing.

- [Create transfer implementation](../../apps/store/src/features/transfers/add/CreateTransfer/)
  owns the page and source change flow; the [shared editor](../../apps/store/src/features/transfers/shared/TransferEditorForm/)
  owns transfer information and the entries table.
- [Validation rules](../../apps/store/src/features/transfers/shared/TransferEditorForm/validations.ts)
  and [validation tests](../../apps/store/src/features/transfers/shared/TransferEditorForm/validations.test.ts)
  cover required fields, destination rules, and quantity limits.
- [Page tests](../../apps/store/src/features/transfers/add/CreateTransfer/CreateTransfer.test.tsx)
  cover the URL source, loading and failure states, and draft review.
- [Entries tests](../../apps/store/src/features/transfers/add/CreateTransfer/TransferEntries.test.tsx)
  cover the stock picker, quantity limits, duplicates, the source change modal,
  the use-all-available action, row deletion, saving a draft, starting a
  transfer, and service errors.
- [Request payload](../../apps/store/src/features/transfers/add/CreateTransfer/utils/getCreateData.ts)
  and [service error mapping](../../apps/store/src/features/transfers/add/CreateTransfer/utils/mapTransferFieldErrors.ts),
  with their tests, define what is sent and where returned errors appear.
- [Create transfer browser test](../../apps/store/e2e/CreateTransfer.spec.ts)
  covers the warehouse detail entry point, unavailable sources, and draft
  publishing.
- [Warehouse detail](warehouse-detail.md) describes the page that launches
  this workflow.
- [Shared DataTable documentation](../data-tables.md) and
  [form conventions](../forms.md) describe reusable implementation contracts.

## Keeping this specification current

Update this document with changes to warehouse rules, stock picking, quantity
validation, the source change flow, or saving in the same change as the
implementation and relevant tests. Keep accepted behavior separate from future
decisions.
