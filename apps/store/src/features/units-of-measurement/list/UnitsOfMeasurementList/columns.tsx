import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getUnitOfMeasurementDetailRoute } from '@/lib/client/routes';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import { UnitOfMeasurementStatusChip } from '../../shared/UnitOfMeasurementStatusChip';

type GetColumnsArgs = {
  onDeleteUnitOfMeasurement: (unitOfMeasurement: UnitOfMeasurement) => void;
};

export const getColumns = ({
  onDeleteUnitOfMeasurement,
}: GetColumnsArgs): DataTableColumnDef<UnitOfMeasurement>[] => [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getUnitOfMeasurementDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '28%',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>
        <UnitOfMeasurementStatusChip status={row.original.status} />
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '18%',
    },
  },
  {
    accessorKey: 'symbol',
    cell: ({ row }) => <DataTableCell>{row.original.symbol}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    meta: {
      width: '18%',
    },
  },
  {
    accessorKey: 'comment',
    cell: ({ row }) => <DataTableCell>{row.original.comment}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    meta: {
      width: '36%',
      wrap: 'wrap',
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
                  onClick={() => onDeleteUnitOfMeasurement(row.original)}
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
