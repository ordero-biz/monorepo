'use client';

import {
  getTransferFormDefaults,
  useCreateTransferForm,
} from './hooks/useCreateTransferForm';
import { TransferInformation } from './TransferInformation';
import type { CreateTransferFormProps } from './types';

export const CreateTransferForm = ({
  sourceWarehouse,
}: CreateTransferFormProps) => {
  const { form } = useCreateTransferForm({
    defaultValues: getTransferFormDefaults(sourceWarehouse),
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
      <TransferInformation form={form} />
    </form>
  );
};
