import { Chip, DataTableCell, DataTableColumnHeader } from '@ordero/ui';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { createTransferColumns } from '@/features/transfers/shared/TransferTable';
import type { Transfer } from '@/lib/domain/transfers/types';

export const createWarehouseTransferColumns = (warehouseId: string | number) =>
  createTransferColumns<Transfer>({
    contextColumns: [
      {
        id: 'direction',
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Warehouse" />
        ),
        cell: ({ row }) => {
          const isIncoming =
            String(row.original.destinationWarehouse.id) ===
            String(warehouseId);
          const counterpart = isIncoming
            ? row.original.sourceWarehouse
            : row.original.destinationWarehouse;

          return (
            <DataTableCell>
              <span className="inline-flex items-center gap-[var(--space-2)]">
                {isIncoming ? (
                  <Chip
                    color="success"
                    size="s"
                    startIcon={<ArrowDownLeft aria-hidden="true" />}
                    variant="soft"
                  >
                    In
                  </Chip>
                ) : (
                  <Chip
                    color="info"
                    size="s"
                    startIcon={<ArrowUpRight aria-hidden="true" />}
                    variant="soft"
                  >
                    Out
                  </Chip>
                )}
                {counterpart.name}
              </span>
            </DataTableCell>
          );
        },
      },
    ],
  });
