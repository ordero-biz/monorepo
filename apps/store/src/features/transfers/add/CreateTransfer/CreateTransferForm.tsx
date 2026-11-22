'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  getTransferDetailRoute,
  getWarehouseDetailRoute,
} from '@/lib/client/routes';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import {
  getTransferFormDefaults,
  SourceWarehouseChangeDialog,
  TransferEditorForm,
  TransferWarehouseReviewDialog,
  useSourceWarehouseChange,
} from '../../shared/TransferEditorForm';
import { useCreateTransferForm } from './hooks/useCreateTransferForm';
import type { CreateTransferFormProps } from './types';

type SourceWarehouseMode = 'prefill' | 'review' | 'manual';

export const CreateTransferForm = ({
  sourceWarehouse,
}: CreateTransferFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isSourceWarehouseActive =
    sourceWarehouse?.status === WAREHOUSE_STATUS.ACTIVE;
  const [sourceWarehouseMode, setSourceWarehouseMode] =
    useState<SourceWarehouseMode>(() => {
      if (!sourceWarehouse) return 'manual';
      return isSourceWarehouseActive ? 'prefill' : 'review';
    });
  const isReviewOpen = sourceWarehouseMode === 'review';

  const { form, submit, validateTransfer, pendingIntent } =
    useCreateTransferForm({
      defaultValues: {
        ...getTransferFormDefaults(),
        sourceWarehouse:
          sourceWarehouseMode === 'prefill' && isSourceWarehouseActive
            ? sourceWarehouse
            : null,
      },
      onCreated: async (transfer) => {
        queryClient.setQueryData(
          transfersQueryKeys.detail(transfer.id),
          transfer
        );

        const warehouseIds =
          transfer.status === TRANSFER_STATUS.DRAFT
            ? []
            : [transfer.sourceWarehouse.id, transfer.destinationWarehouse.id];

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

        // Only drafts have a detail view so far.
        router.replace(
          transfer.status === TRANSFER_STATUS.DRAFT
            ? getTransferDetailRoute(transfer.id)
            : getWarehouseDetailRoute(transfer.sourceWarehouse.id)
        );
      },
    });
  const sourceChange = useSourceWarehouseChange(form);
  // The initial review dialog has no trigger, so return focus to the selector when it closes.
  const sourceWarehouseRef = useRestoreFocus<HTMLInputElement>(
    isReviewOpen || sourceChange.pendingChange !== null
  );

  return (
    <TransferEditorForm
      form={form}
      onSourceWarehouseChange={sourceChange.requestChange}
      pendingIntent={pendingIntent}
      sourceWarehouseRef={sourceWarehouseRef}
      submit={submit}
      validateTransfer={validateTransfer}
    >
      <SourceWarehouseChangeDialog
        onCancel={sourceChange.cancelChange}
        onConfirm={sourceChange.confirmChange}
        pendingChange={sourceChange.pendingChange}
      />
      <TransferWarehouseReviewDialog
        onClose={() => setSourceWarehouseMode('manual')}
        onSelect={sourceChange.requestChange}
        warehouse={isReviewOpen ? sourceWarehouse : null}
      />
    </TransferEditorForm>
  );
};
