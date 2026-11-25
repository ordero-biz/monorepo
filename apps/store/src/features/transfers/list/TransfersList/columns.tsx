import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getTransferDetailRoute } from '@/lib/client/routes';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { Transfer } from '@/lib/domain/transfers/types';
import { formatDate } from '@/lib/utils/formatDate';
import { TransferStatusChip } from '../../shared/TransferStatusChip';

type GetColumnsArgs = {
  onDeleteTransfer: (transfer: Transfer) => void;
};

export const getColumns = ({
  onDeleteTransfer,
}: GetColumnsArgs): DataTableColumnDef<Transfer>[] => [
  {
    accessorKey: 'transferNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transfer number" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="rounded-[var(--radius-sm)] font-600 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          href={getTransferDetailRoute(row.original.id)}
        >
          {row.original.transferNumber}
        </Link>
      </DataTableCell>
    ),
  },
  {
    accessorKey: 'sourceWarehouse.name',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From warehouse" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.sourceWarehouse.name}</DataTableCell>
    ),
  },
  {
    accessorKey: 'destinationWarehouse.name',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To warehouse" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.destinationWarehouse.name}</DataTableCell>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <TransferStatusChip status={row.original.status} />
      </DataTableCell>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{formatDate(row.original.createdAt)}</DataTableCell>
    ),
  },
  {
    cell: ({ row }) => {
      if (row.original.status !== TRANSFER_STATUS.DRAFT) {
        return <DataTableCell variant="actions">{null}</DataTableCell>;
      }

      const transferTitle = row.original.transferNumber || 'Transfer';

      return (
        <DataTableCell variant="actions">
          <Menu.Root>
            <Menu.Trigger
              aria-label={`Actions for ${transferTitle}`}
              appearance="iconButton"
              size="xs"
              title={`Actions for ${transferTitle}`}
            >
              <EllipsisVertical aria-hidden="true" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner align="end">
                <Menu.Popup>
                  <Menu.Item
                    color="error"
                    onClick={() => onDeleteTransfer(row.original)}
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
      );
    },
    header: () => null,
    id: 'actions',
    meta: {
      align: 'right',
      wrap: 'nowrap',
    },
  },
];
