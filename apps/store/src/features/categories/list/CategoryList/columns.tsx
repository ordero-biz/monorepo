import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getCategoryDetailRoute } from '@/lib/client/routes';
import type { Category } from '@/lib/domain/categories/types';
import { formatDate } from '@/lib/utils/formatDate';
import { CategoryStatusChip } from '../../shared/CategoryStatusChip';

type GetColumnsArgs = {
  onDeleteCategory: (category: Category) => void;
};

export const getColumns = ({
  onDeleteCategory,
}: GetColumnsArgs): DataTableColumnDef<Category>[] => [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getCategoryDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '25%',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>
        <CategoryStatusChip status={row.original.status} />
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '15%',
    },
  },
  {
    accessorFn: (row) => row.parentCategory?.name ?? 'None',
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.parentCategory ? (
          <Link
            className="w-full rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
            href={getCategoryDetailRoute(row.original.parentCategory.id)}
          >
            {row.original.parentCategory.name}
          </Link>
        ) : (
          'None'
        )}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent category" />
    ),
    id: 'parentCategory',
    meta: {
      width: '25%',
    },
  },
  {
    accessorFn: (row) => row.parentCategory?.status ?? '',
    cell: ({ row }) => (
      <DataTableCell>
        <CategoryStatusChip status={row.original.parentCategory?.status} />
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent status" />
    ),
    id: 'parentStatus',
    meta: {
      width: '15%',
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
      width: '20%',
    },
  },
  {
    cell: ({ row }) => (
      <DataTableCell variant="actions">
        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${row.original.name}`}
            appearance="iconButton"
            size="xs"
            title={`Actions for ${row.original.name}`}
          >
            <EllipsisVertical aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                <Menu.Item
                  color="error"
                  onClick={() => onDeleteCategory(row.original)}
                >
                  <Trash2
                    aria-hidden="true"
                    className="size-[var(--icon-button-xs-icon)]"
                  />
                  Delete
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </DataTableCell>
    ),
    header: () => null,
    id: 'actions',
    meta: {
      align: 'right',
      wrap: 'nowrap',
    },
  },
];
