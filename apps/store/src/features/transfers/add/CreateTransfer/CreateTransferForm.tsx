'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getWarehouseDetailRoute } from '@/lib/client/routes';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { useCreateTransferForm } from './hooks/useCreateTransferForm';
import { useSourceWarehouseChange } from './hooks/useSourceWarehouseChange';
import { SourceWarehouseChangeDialog } from './SourceWarehouseChangeDialog';
import { TransferEntries } from './TransferEntries';
import { TransferInformation } from './TransferInformation';
import { TransferWarehouseReviewDialog } from './TransferWarehouseReviewDialog';
import type { CreateTransferFormProps } from './types';
import { getTransferFormDefaults } from './utils/entries';

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

  const { form, submit, pendingIntent } =
    useCreateTransferForm({
      defaultValues: getTransferFormDefaults(
        sourceWarehouseMode === 'prefill' && isSourceWarehouseActive
          ? sourceWarehouse
          : null
      ),
      onCreated: async (transfer) => {
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

        router.replace(getWarehouseDetailRoute(transfer.sourceWarehouse.id));
      },
    });
  const sourceChange = useSourceWarehouseChange(form);
  // The initial review dialog has no trigger, so return focus to the selector when it closes.
  const sourceWarehouseRef = useRestoreFocus<HTMLInputElement>(
    isReviewOpen || sourceChange.pendingChange !== null
  );
  const disabled = pendingIntent !== null;

  return (
    <form
      aria-busy={disabled}
      aria-label="Transfer"
      className="flex flex-col gap-[var(--space-3)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        return submit('draft');
      }}
    >
      <TransferInformation
        disabled={disabled}
        form={form}
        onSourceWarehouseChange={sourceChange.requestChange}
        sourceWarehouseRef={sourceWarehouseRef}
      />
      <form.Subscribe selector={(state) => state.values.transferEntries}>
        {(entries) => (
          <TransferEntries
            disabled={disabled}
            entries={entries}
            form={form}
            onSaveDraft={() => submit('draft')}
            onTransfer={() => submit('transfer')}
            pendingIntent={pendingIntent}
          />
        )}
      </form.Subscribe>
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
    </form>
  );
};
