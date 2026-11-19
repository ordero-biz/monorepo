'use client';

import { useState } from 'react';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';
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
  const isSourceWarehouseActive =
    sourceWarehouse?.status === WAREHOUSE_STATUS.ACTIVE;
  const [sourceWarehouseMode, setSourceWarehouseMode] =
    useState<SourceWarehouseMode>(() => {
      if (!sourceWarehouse) return 'manual';
      return isSourceWarehouseActive ? 'prefill' : 'review';
    });
  const isReviewOpen = sourceWarehouseMode === 'review';

  const { form } = useCreateTransferForm({
    defaultValues: getTransferFormDefaults(
      sourceWarehouseMode === 'prefill' && isSourceWarehouseActive
        ? sourceWarehouse
        : null
    ),
  });
  const sourceChange = useSourceWarehouseChange(form);
  // The initial review dialog has no trigger, so return focus to the selector when it closes.
  const sourceWarehouseRef = useRestoreFocus<HTMLInputElement>(
    isReviewOpen || sourceChange.pendingChange !== null
  );

  return (
    <form
      aria-label="Transfer"
      className="flex flex-col gap-[var(--space-3)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        return form.handleSubmit();
      }}
    >
      <TransferInformation
        form={form}
        onSourceWarehouseChange={sourceChange.requestChange}
        sourceWarehouseRef={sourceWarehouseRef}
      />
      <form.Subscribe selector={(state) => state.values.transferEntries}>
        {(entries) => <TransferEntries entries={entries} form={form} />}
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
