import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import type { AttributeValue } from '@/lib/domain/attributes';

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
      width: '100%',
    },
  },
  {
    cell: ({ row }) => (
      <DataTableCell>
        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${row.original.name}`}
            appearance="iconButton"
            size="s"
            title={`Actions for ${row.original.name}`}
          >
            <EllipsisVertical aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                <Menu.Item onClick={() => onUpdateAttributeValue(row.original)}>
                  <Pencil
                    aria-hidden="true"
                    className="size-[var(--icon-button-xs-icon)]"
                  />
                  Edit
                </Menu.Item>
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
