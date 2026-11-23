'use client';

import { Card, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import {
  getTransferFormDefaults,
  SourceWarehouseChangeDialog,
  TransferEditorForm,
  useSourceWarehouseChange,
} from '../../shared/TransferEditorForm';
import { TransferInProgressDetail } from '../TransferInProgressDetail';
import { useUpdateTransferForm } from './hooks/useUpdateTransferForm';
import type { UpdateTransferProps } from './types';

export const UpdateTransfer = ({ transfer }: UpdateTransferProps) => {
  const queryClient = useQueryClient();
  // The PATCH baseline and expected version advance together, only after a
  // successful save, so a background refresh never drops unsaved edits.
  const [baseline, setBaseline] = useState(transfer);
  const { form, submit, pendingIntent } = useUpdateTransferForm({
    transfer: baseline,
    onUpdated: async (updatedTransfer) => {
      queryClient.setQueryData<TransferDetails>(
        transfersQueryKeys.detail(updatedTransfer.id),
        (cachedTransfer) =>
          cachedTransfer && cachedTransfer.version > updatedTransfer.version
            ? cachedTransfer
            : updatedTransfer
      );

      const warehouseIds =
        updatedTransfer.status === TRANSFER_STATUS.DRAFT
          ? []
          : [
              updatedTransfer.sourceWarehouse.id,
              updatedTransfer.destinationWarehouse.id,
            ];

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transfersQueryKeys.list,
        }),
        ...warehouseIds.flatMap((warehouseId) => [
          queryClient.invalidateQueries({
            queryKey: warehousesQueryKeys.stock(warehouseId),
          }),
          queryClient.invalidateQueries({
            queryKey: warehousesQueryKeys.detail(warehouseId),
          }),
        ]),
      ]);

      form.reset(getTransferFormDefaults(updatedTransfer));
      setBaseline(updatedTransfer);
    },
  });
  const sourceChange = useSourceWarehouseChange(form);
  const sourceWarehouseRef = useRestoreFocus<HTMLInputElement>(
    sourceChange.pendingChange !== null
  );
  if (baseline.status === TRANSFER_STATUS.IN_TRANSIT) {
    return <TransferInProgressDetail transfer={baseline} />;
  }

  if (baseline.status !== TRANSFER_STATUS.DRAFT) {
    // Completed and Rejected get their own views later.
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Details for this transfer status are not available yet.
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <div
        className="rounded-[var(--radius)] bg-muted p-[var(--space-1-5)]"
        role="note"
      >
        <Typography variant="body2">
          <strong>Draft.</strong> Nothing has left the warehouse yet. You can
          change everything until you press Transfer.
        </Typography>
      </div>
      <TransferEditorForm
        form={form}
        onSourceWarehouseChange={sourceChange.requestChange}
        pendingIntent={pendingIntent}
        sourceWarehouseRef={sourceWarehouseRef}
        submit={submit}
      >
        <SourceWarehouseChangeDialog
          onCancel={sourceChange.cancelChange}
          onConfirm={sourceChange.confirmChange}
          pendingChange={sourceChange.pendingChange}
        />
      </TransferEditorForm>
    </div>
  );
};
