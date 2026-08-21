import {
  Chip,
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { Attribute } from '@/lib/domain/attributes/types';
import { formatDate } from '@/lib/utils/formatDate';

const statusLabels = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
} as const;

const getStatusChip = (status?: Attribute['status']) => {
  if (!status) {
    return null;
  }

  return (
    <Chip
      color={status === ATTRIBUTE_STATUS.ACTIVE ? 'primary' : 'warning'}
      size="s"
      variant="soft"
    >
      {statusLabels[status]}
    </Chip>
  );
};

export const columns: DataTableColumnDef<Attribute>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getAttributeDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '50%',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>{getStatusChip(row.original.status)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '25%',
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
      width: '25%',
    },
  },
];
