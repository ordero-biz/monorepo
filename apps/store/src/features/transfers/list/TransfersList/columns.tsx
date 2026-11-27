import { DataTableCell, DataTableColumnHeader } from '@ordero/ui';
import type { Transfer } from '@/lib/domain/transfers/types';
import { createTransferColumns } from '../../shared/TransferTable';

export const columns = createTransferColumns<Transfer>({
  contextColumns: [
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
  ],
});
