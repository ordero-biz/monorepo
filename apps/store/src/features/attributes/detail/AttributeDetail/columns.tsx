import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
} from '@ordero/ui';
import { CircleCheck, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { AttributeStatusChip } from '../../shared/AttributeStatusChip';

type GetColumnsArgs = {
  canPublishAttributeValue: boolean;
  onActivateAttributeValue: (attributeValue: AttributeValue) => void;
  onDeleteAttributeValue: (attributeValue: AttributeValue) => void;
  onUpdateAttributeValue: (attributeValue: AttributeValue) => void;
};

export const getColumns = ({
  canPublishAttributeValue,
  onActivateAttributeValue,
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
      <DataTableCell>
        <AttributeStatusChip status={row.original.status} />
      </DataTableCell>
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
                {row.original.status !== ATTRIBUTE_VALUE_STATUS.ACTIVE ? (
                  <>
                    <Menu.Item
                      onClick={() => onUpdateAttributeValue(row.original)}
                    >
                      <Pencil
                        aria-hidden="true"
                        className="size-[var(--icon-button-xs-icon)]"
                      />
                      Edit
                    </Menu.Item>
                    {canPublishAttributeValue ? (
                      <Menu.Item
                        onClick={() => onActivateAttributeValue(row.original)}
                      >
                        <CircleCheck
                          aria-hidden="true"
                          className="size-[var(--icon-button-xs-icon)]"
                        />
                        Publish
                      </Menu.Item>
                    ) : null}
                  </>
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
