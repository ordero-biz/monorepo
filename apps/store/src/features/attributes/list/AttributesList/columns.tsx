import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import type { Attribute } from '@/lib/domain/attributes/types';
import { formatDate } from '@/lib/utils/formatDate';
import { AttributeStatusChip } from '../../shared/AttributeStatusChip';

type GetColumnsArgs = {
  onDeleteAttribute: (attribute: Attribute) => void;
};

export const getColumns = ({
  onDeleteAttribute,
}: GetColumnsArgs): DataTableColumnDef<Attribute>[] => [
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
      <DataTableCell>
        <AttributeStatusChip status={row.original.status} />
      </DataTableCell>
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
                  onClick={() => onDeleteAttribute(row.original)}
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
