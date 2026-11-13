import { DataTableCell, type DataTableColumnDef } from '@ordero/ui';
import { ProductVariantBarcodeField } from './ProductVariantBarcodeField';
import { ProductVariantNameField } from './ProductVariantNameField';
import { ProductVariantSkuField } from './ProductVariantSkuField';
import { ProductVariantStatusField } from './ProductVariantStatusField';
import type { GetColumnsArgs } from './types';

export const getColumns = ({
  form,
}: GetColumnsArgs): DataTableColumnDef<number>[] => [
  {
    id: 'name',
    header: () => <DataTableCell>Variant name *</DataTableCell>,
    cell: ({ row }) => (
      <DataTableCell width="full">
        <ProductVariantNameField form={form} variantIndex={row.original} />
      </DataTableCell>
    ),
    meta: { minWidth: 'var(--space-20)' },
  },
  {
    id: 'sku',
    header: () => <DataTableCell>SKU *</DataTableCell>,
    cell: ({ row }) => (
      <DataTableCell width="full">
        <ProductVariantSkuField form={form} variantIndex={row.original} />
      </DataTableCell>
    ),
    meta: { minWidth: 'var(--space-20)' },
  },
  {
    id: 'barcode',
    header: () => <DataTableCell>Barcode *</DataTableCell>,
    cell: ({ row }) => (
      <DataTableCell width="full">
        <ProductVariantBarcodeField form={form} variantIndex={row.original} />
      </DataTableCell>
    ),
    meta: { minWidth: 'var(--space-20)' },
  },
  {
    id: 'status',
    header: () => <DataTableCell>Status after creation *</DataTableCell>,
    cell: ({ row }) => (
      <DataTableCell width="full">
        <ProductVariantStatusField form={form} variantIndex={row.original} />
      </DataTableCell>
    ),
    meta: { minWidth: 'var(--space-20)' },
  },
];
