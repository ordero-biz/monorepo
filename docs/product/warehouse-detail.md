# Warehouse Detail Business Rules and UX Decisions

Status: accepted for the current implementation. Updated: 2026-10-28.

The warehouse detail page helps store operators see the value of stock held in
one warehouse and inspect the products contributing to that value. It shows
warehouse identity and status, an inventory value summary, warehouse details,
and a paginated product table.

## Inventory value

The summary is labelled **Inventory value** and uses **At cost** as its visible
valuation basis. This represents the cost of stock held in the warehouse.
It does not represent sales revenue, profit, or expected revenue.

Cost-based and selling-price valuations answer different questions:

| Basis | Meaning | Current product decision |
| --- | --- | --- |
| At cost | Money invested in the stock held in the warehouse. | Display this basis. |
| At selling price | The retail value of that stock at its selling prices. | Not implemented; would require an explicit separate metric. |

Conceptually, stock value is quantity multiplied by the corresponding unit
cost, summed across stock records. The backend owns the actual valuation
calculation. The frontend displays its aggregate and does not reconstruct a
costing method from the product table.

The summary always covers the **entire warehouse**, including records on other
product pages. Changing the table page or page size must not change its scope.

## Data and display contract

| Display | Source | Rule |
| --- | --- | --- |
| Inventory value | `GET /api/v1/warehouses/{id}` → `totalPrice` | Use the warehouse aggregate directly. Never sum the loaded table page. |
| Stock value for a row | `GET /api/v1/warehouses/{id}/stock` → `content[].totalPrice` | Display the backend's value for that stock record. |
| Quantity and unit | `content[].quantity` and `content[].unitOfMeasurement` | Keep the quantity associated with its unit. |
| Products count | Stock response → `page.totalElements` | Show the total number of stock records across pages, not the number currently loaded or a sum of quantities. |
| Currency | Existing app money formatter | Display dollar-formatted amounts and an explicit `USD` code in the summary. |

Stock rows are identified by product variant and unit of measurement together.
The Products count therefore counts stock records; it is not guaranteed to be
a count of distinct product variants.

The API fields retain their `totalPrice` names. User-facing labels express
their meaning without requiring a backend field rename.

USD is currently fixed in the app formatter; the warehouse response does not
provide a currency field. Currency selection or conversion is not implemented.

## UX decisions and rationale

| Decision | Rationale |
| --- | --- |
| Use **Inventory value** for the summary and **Stock value** for table amounts. | Distinguish stock valuation from an item's selling price or an order total. |
| Keep **At cost** and the currency visible. | Users need both to interpret the amount without opening another control. |
| Place a green summary card beside warehouse details, above the table. | Users can see the total before inspecting its contributing stock records. |
| Use the shared Card with its primary color and filled variant. | Keep the summary's tint, shadow, radius, and padding consistent with the design system. |
| Do not add a tooltip to the summary card. | The essential explanation is already visible in its label and supporting text. |
| Show the warehouse total only in the summary card. | Repeating the same total in the table footer adds no information. |
| Do not show a combined quantity total. | Quantities with different units, such as grams and boxes, cannot be meaningfully added together. |
| Right-align quantities and monetary values; use tabular numerals. | Consistent alignment makes rows easier to compare. |
| Put the Products heading and count in the DataTable header slot. | Keep collection context with the table and outside its horizontal scroll area. |
| Stack inventory value, warehouse details, and products on narrow screens. | Preserve the reading order when the summary and details cannot fit side by side. |

The responsive warehouse content is implemented. Mobile app navigation remains
a separate task; the existing desktop sidebar still limits the full page's
usability on phone screens.

## Empty and error states

- A total of `0` is a valid value and displays as **$0.00 USD**.
- The warehouse total is a required number. The inventory card always displays
  the amount and currency; it has no missing or null total state.
- An empty stock list displays **No products found in this warehouse.**
- While warehouse details load, show the warehouse loading state. A failed
  warehouse request shows an error and a Retry action.
- Stock-list loading and failure states belong to the products section. A
  stock-list failure must not hide an already loaded warehouse inventory value.
- Empty address, comment, or barcode values display a dash. Empty SKU or missing
  unit-symbol values are omitted. SKU and barcode are required strings;
  address is required but nullable.

## Questions for future changes

- **Costing policy:** FIFO, weighted average, tax treatment, and treatment of
  reserved or damaged stock are not defined by the frontend contract. Confirm
  the backend policy before documenting a more specific financial calculation.
- **Units:** a name such as “100 g loose leaf” does not establish whether a
  quantity means grams or packs. The unit must match the quantity and valuation
  basis; pack conversion rules need an explicit domain contract.
- **Search and filters:** the current page has neither. If introduced, keep the
  warehouse summary global. Any separate filtered subtotal must have a distinct
  label and a clear scope across all matching pages.
- **Multiple currencies or retail valuation:** require explicit data contracts
  and visible labels before adding them to the UI.

## Evidence and implementation references

- The accepted UX decisions above come from the warehouse detail design review
  on 2026-10-28. They are product decisions, not results from usability testing.
- [Warehouse API documentation](https://ordero-service-production.up.railway.app/swagger-ui/index.html#/warehouse-controller/getWarehouse)
  defines the warehouse detail and stock response fields. Its schema was checked
  on 2026-10-28; it does not specify the costing policy.
- [Shopify inventory reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/inventory-reports)
  distinguish inventory cost from selling-price value. This supports the
  terminology distinction; Ordero does not inherit Shopify's calculation rules.
- [Warehouse detail implementation](../../apps/store/src/features/warehouses/detail/WarehouseDetail/)
  owns page composition, labels, and stock columns.
- [Inventory card tests](../../apps/store/src/features/warehouses/detail/WarehouseDetail/WarehouseDetailInventoryValue.test.tsx)
  cover formatting, currency, scope copy, zero, and fractional values.
- [Warehouse detail tests](../../apps/store/src/features/warehouses/detail/WarehouseDetail/WarehouseDetail.test.tsx)
  cover aggregate scope and independence from product-list failures.
- [Warehouse pagination browser test](../../apps/store/e2e/WarehouseStockPagination.spec.ts)
  checks the aggregate while navigating product pages.
- [Shared DataTable documentation](../data-tables.md) describes the reusable
  header and pagination APIs.

## Keeping this specification current

Update this file with changes to metric meaning, labels, scope, currency, or
error behavior in the same PR as the implementation and relevant tests. Keep
accepted rules separate from unresolved questions. Link to shared component
and HTTP documentation for implementation conventions rather than copying
those conventions here.
