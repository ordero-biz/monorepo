import { DataTableCell, DataTableColumnHeader } from '@ordero/ui';
import type { Supply } from '@/lib/domain/supplies/types';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';
import { createSupplyColumns } from '../../shared/SupplyTable';

export const columns = createSupplyColumns<Supply>({
  contextColumns: [
    {
      accessorKey: 'warehouse.name',
      enableSorting: false,
      cell: ({ row }) => (
        <DataTableCell>{row.original.warehouse.name}</DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Warehouse" />
      ),
    },
    {
      accessorKey: 'status',
      enableSorting: false,
      cell: ({ row }) => (
        <DataTableCell>
          <SupplyStatusChip status={row.original.status} />
        </DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
  ],
});
