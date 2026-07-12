import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  IconButton,
} from '@ordero/ui';
import { Pencil, Trash2 } from 'lucide-react';
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
        <IconButton
          aria-label={`Edit ${row.original.name}`}
          onClick={() => onUpdateAttributeValue(row.original)}
          size="s"
          title={`Edit ${row.original.name}`}
        >
          <Pencil aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label={`Delete ${row.original.name}`}
          onClick={() => onDeleteAttributeValue(row.original)}
          size="s"
          title={`Delete ${row.original.name}`}
        >
          <Trash2 aria-hidden="true" />
        </IconButton>
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
