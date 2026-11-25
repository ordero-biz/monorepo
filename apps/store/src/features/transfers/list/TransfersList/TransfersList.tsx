'use client';

import { useMemo, useState } from 'react';
import type { Transfer } from '@/lib/domain/transfers/types';
import { useTransfersQuery } from '@/lib/hooks/transfers/useTransfersQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { Button, Card, DataTable, Typography } from '@/ui/index';
import { DeleteTransferDialog } from '../../shared/DeleteTransfer';
import { getColumns } from './columns';
import type { TransfersListProps } from './types';

export const TransfersList = ({ paginationInput }: TransfersListProps) => {
  const transfersQuery = useTransfersQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: transfersQuery.data?.page,
    paginationInput,
  });
  const [deletingTransfer, setDeletingTransfer] = useState<Transfer | null>(
    null
  );

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteTransfer: setDeletingTransfer,
      }),
    []
  );

  if (transfersQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading transfers...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (transfersQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your transfers right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => transfersQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <>
      <DataTable
        ariaLabel="Transfers list"
        columns={columns}
        data={transfersQuery.data.content}
        emptyMessage="No transfers found."
        getRowId={(row) => String(row.id)}
        manualPagination
        pagination={tablePagination}
      />

      {deletingTransfer ? (
        <DeleteTransferDialog
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingTransfer(null);
            }
          }}
          open={Boolean(deletingTransfer)}
          transfer={deletingTransfer}
        />
      ) : null}
    </>
  );
};
