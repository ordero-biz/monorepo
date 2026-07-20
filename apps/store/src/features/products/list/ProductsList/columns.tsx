import type { Product, ProductVariant } from '@/lib/domain/products';
import { formatDate } from '@/lib/utils/formatDate';
import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@/ui/index';

const getProductVariantAttributesText = (productVariant: ProductVariant) => {
  const attributes = productVariant.productVariantAttributeValues.map(
    ({ attribute, attributeValue }) =>
      `${attribute.name}: ${attributeValue.name}`
  );

  return attributes.length > 0 ? attributes.join(', ') : '-';
};

export const productGroupColumns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => <DataTableCell>{row.original.name}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '40%',
    },
  },
  {
    accessorKey: 'category.name',
    cell: ({ row }) => (
      <DataTableCell>{row.original.category.name}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    meta: {
      width: '34%',
    },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <DataTableCell>{formatDate(row.original.createdAt)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    meta: {
      width: '26%',
    },
  },
];

export const productVariantColumns: DataTableColumnDef<ProductVariant>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => <DataTableCell>{row.original.name}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '26%',
    },
  },
  {
    accessorKey: 'sku',
    cell: ({ row }) => <DataTableCell>{row.original.sku}</DataTableCell>,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    meta: {
      width: '14%',
    },
  },
  {
    accessorKey: 'barcode',
    cell: ({ row }) => <DataTableCell>{row.original.barcode}</DataTableCell>,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barcode" />
    ),
    meta: {
      width: '14%',
    },
  },
  {
    id: 'attributes',
    cell: ({ row }) => (
      <DataTableCell>
        {getProductVariantAttributesText(row.original)}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attributes" />
    ),
    meta: {
      width: '30%',
      wrap: 'wrap',
    },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <DataTableCell>{formatDate(row.original.createdAt)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    meta: {
      width: '10%',
    },
  },
];
