import {
  Chip,
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import type { AttributeValue } from '@/lib/domain/attributes/types';

const statusLabels = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
} as const;

const getStatusChip = (status?: AttributeValue['status']) => {
  if (!status) {
    return null;
  }

  return (
    <Chip
      color={status === 'ACTIVE' ? 'primary' : 'warning'}
      size="s"
      variant="soft"
    >
      {statusLabels[status]}
    </Chip>
  );
};

type GetColumnsArgs = {
  onDeleteAttributeValue: (attributeValue: AttributeValue) => void;
  onUpdateAttributeValue: (attributeValue: AttributeValue) => void;
};

export const getColumns = ({
  onDeleteAttributeValue,
  onUpdateAttributeValue,
}: GetColumnsArgs): DataTableColumnDef<AttributeValue>[] => [
  {
    accessorKey: 'name',
    cell: ({ row }) => <DataTableCell>{row.original.name}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '80%',
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
                {row.original.status !== 'ACTIVE' ? (
                  <Menu.Item
                    onClick={() => onUpdateAttributeValue(row.original)}
                  >
                    <Pencil
                      aria-hidden="true"
                      className="size-[var(--icon-button-xs-icon)]"
                    />
                    Edit
                  </Menu.Item>
                ) : null}
                <Menu.Item
                  color="error"
                  onClick={() => onDeleteAttributeValue(row.original)}
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
