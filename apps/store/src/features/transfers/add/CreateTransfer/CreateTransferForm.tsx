'use client';

import { useState } from 'react';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';
import {
  getTransferFormDefaults,
  useCreateTransferForm,
} from './hooks/useCreateTransferForm';
import { TransferInformation } from './TransferInformation';
import { TransferWarehouseReviewDialog } from './TransferWarehouseReviewDialog';
import type { CreateTransferFormProps } from './types';

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
  const sourceWarehouseRef = useRestoreFocus<HTMLInputElement>(isReviewOpen);

  const { form } = useCreateTransferForm({
    defaultValues: getTransferFormDefaults(
      sourceWarehouseMode === 'prefill' && isSourceWarehouseActive
        ? sourceWarehouse
        : null
    ),
  });

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
        sourceWarehouseRef={sourceWarehouseRef}
      />
      <TransferWarehouseReviewDialog
        onClose={() => setSourceWarehouseMode('manual')}
        onSelect={(warehouse) =>
          form.setFieldValue('sourceWarehouse', warehouse)
        }
        warehouse={isReviewOpen ? sourceWarehouse : null}
      />
    </form>
  );
};
