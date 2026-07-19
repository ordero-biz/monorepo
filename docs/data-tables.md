# Data Tables

## Purpose

`DataTable` in `@ordero/ui` is the shared presentation and interaction layer
for tabular app data. Features own their row shape, column definitions,
queries, mutations, and bulk-action workflows. The component owns table
rendering, client-side sorting and pagination when enabled, and the standard
current-page selection interaction.

Read this guide before changing `packages/ui/src/components/DataTable` or
adding a selectable table to an app feature.

## Architecture and evolution

| Pattern | Status | Ownership | Select-all scope |
| --- | --- | --- | --- |
| Consumer-defined columns with `selectable` and custom checkbox cells | Initial API; retained for compatibility | The feature owns the complete selection column | The feature must match the standard current-page behavior |
| `DataTableSelectionCell` and `DataTableSelectionColumnHeader` | Previous reusable composition API; advanced use only | The feature owns the custom layout; the helpers own checkbox wiring | Current page |
| `selection` prop and `useDataTableSelection` | Current standard | `DataTable` adds the selection column; the feature owns selection state and bulk actions | Current page |

New feature work must use the current standard unless the selection checkbox
must share a cell with feature-specific content or needs a custom column
header. The composition helpers are not a second default API. They are kept
for that advanced layout case and follow exactly the same selection scope.

## Table responsibilities

`DataTable` accepts stable `columns` and `data` references and supports:

- accessible table labelling through the required `ariaLabel`
- custom cells, widths, alignment, wrapping, empty states, and row ids
- controlled or uncontrolled sorting; use `manualSorting` for server sorting
- client or server pagination; use `manualPagination` when `data` already
  contains only the server-provided page
- controlled or uncontrolled row selection
- a built-in selection column through `selection`

Feature code owns fetching, filters, request parameters, mutation effects,
dialogs, toasts, and bulk-action bars. Do not put an app resource's query or
mutation logic into `DataTable`.

## Current selection standard

Use `useDataTableSelection` when a feature needs selected records for bulk
actions. It returns the `selection` object for the table, the rows represented
by the current `data`, and `clearSelection` for a completed action.

```tsx
const {
  clearSelection,
  selectedRows,
  selection,
} = useDataTableSelection({
  data: attributeValuesQuery.data,
  getRowCheckboxAriaLabel: (value) => `Select ${value.name}`,
  getRowId: (value) => String(value.id),
  selectAllCheckboxAriaLabel: 'Select all attribute values',
});

<DataTable
  ariaLabel="Attribute values"
  columns={columns}
  data={attributeValuesQuery.data}
  getRowId={(value) => String(value.id)}
  selection={selection}
/>;
```

Always provide the same stable domain `getRowId` to the table and the hook.
Array indexes are not stable across sorting, filtering, pagination, or a data
refresh and can apply a selection to the wrong record.

The table adds a leading checkbox column automatically. Do not add a second
selection column to `columns`.

### Checkbox behavior

- A row checkbox selects or clears that row.
- The header checkbox selects or clears selectable rows on the current visible
  page. It is checked when all selectable page rows are selected and
  indeterminate when only some are selected.
- A row excluded by `getRowCanSelect` has no built-in checkbox. The header
  checkbox ignores it.
- Row and header checkboxes require meaningful accessible labels. Use labels
  that identify the record and the collection, not generic labels such as
  `Select`.
- `selectedRows` is derived from the hook's current `data`. It intentionally
  does not promise a cross-page collection of records.

### Pagination and server data

Select-all is page-local. In a client-paginated table, it affects the rendered
page rather than every loaded row. In a manually paginated table, it affects
only the current server response. Moving to another page does not select its
rows; `useDataTableSelection` resolves `selectedRows` only from the current
response, even if row-selection ids remain in state.

If a product requirement needs selection across pages, define an explicit
resource-level selection model before extending the shared table: whether it
stores ids or an inverted "all matching" query, how filters affect it, what the
bulk endpoint accepts, and how the UI communicates the scope. Do not change
the default select-all behavior to mean every loaded or matching record.

### Bulk-action lifecycle

Keep the bulk-action UI in the feature. Show it only when `selectedRows` is
non-empty, pass those rows or their ids to the confirmation flow, and call
`clearSelection` only after the mutation succeeds. Closing a dialog or a
failed request must preserve the selection so the user can retry.

## Advanced and legacy composition

Use `DataTableSelectionCell` and `DataTableSelectionColumnHeader` only when a
checkbox must be embedded beside feature-specific cell or header content. Pass
the TanStack `row`, `column`, and `table` objects through the helpers. The
feature must still pass `selectable`, stable `getRowId`, and accessible labels.

Do not create a raw checkbox column for new work. It duplicates the selection
contract and can easily drift on indeterminate state, disabled rows, labels, or
current-page behavior.

## Sorting and pagination

- Keep `columns`, `data`, and controlled `sorting` references stable. Hoist
  static columns and memoize derived data or dynamic columns.
- Use the default sorting behavior only when all rows needed for sorting are in
  `data`. With server sorting, use `manualSorting`, own `sorting` and
  `onSortingChange` in the feature, and refetch from that state.
- With client pagination, provide all rows in `data` and let `DataTable` derive
  the page. With server pagination, provide the current page, the total
  `pagination.count`, and `manualPagination`.
- Test server sorting without assuming local rows reorder before the new server
  response arrives.

## Required coverage

For shared DataTable changes, add behavior-focused unit coverage for the
affected public contract and update Storybook when its documented API changes.
For a selectable feature, cover the meaningful user flow at the nearest useful
layer:

- accessible table and checkbox names
- individual selection, select-all, and indeterminate state when relevant
- excluded rows when `getRowCanSelect` is used
- current-page select-all when pagination is involved
- bulk-action visibility and clearing only after successful completion
- server sorting or pagination behavior when the feature uses it

Use Testing Library for component-local behavior, Storybook browser checks for
shared component states, and Playwright only for routed, composed app flows.
