'use client';

import attributesResponse from '@/data/GET_api_v1_attributes.json';
import {
  DataTable,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@/ui/index';
import type { AttributeRow, AttributesApiResponse } from './types';

const formatCreatedAt = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const renderTextCell = (value: string | number) => (
  <div className="px-[var(--spacing-2)] py-[var(--spacing-2)]">{value}</div>
);

const columns: DataTableColumnDef<AttributeRow>[] = [
  {
    accessorKey: 'id',
    cell: ({ row }) => renderTextCell(row.original.id),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    meta: {
      align: 'right',
      width: 96,
      wrap: 'nowrap',
    },
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => renderTextCell(row.original.name),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'sortOrder',
    cell: ({ row }) => renderTextCell(row.original.sortOrder),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sort Order" />
    ),
    meta: {
      align: 'right',
      width: 140,
      wrap: 'nowrap',
    },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => renderTextCell(formatCreatedAt(row.original.createdAt)),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    meta: {
      wrap: 'nowrap',
    },
  },
];

export default function AttributesPage() {
  const data = (attributesResponse as AttributesApiResponse).content;

  return (
    <DataTable
      ariaLabel="Attributes table"
      columns={columns}
      data={data}
      emptyMessage="No attributes found."
    />
  );
}
