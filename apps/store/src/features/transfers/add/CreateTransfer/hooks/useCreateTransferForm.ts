'use client';

import { useForm } from '@tanstack/react-form';
import type { TransferFormValues } from '../types';

type UseCreateTransferFormArgs = {
  defaultValues: TransferFormValues;
};

export const getTransferFormDefaults = (
  sourceWarehouse: TransferFormValues['sourceWarehouse'] = null
): TransferFormValues => ({
  transferNumber: '',
  sourceWarehouse,
  destinationWarehouse: null,
  comment: '',
});

export const useCreateTransferForm = ({
  defaultValues,
}: UseCreateTransferFormArgs) => {
  const form = useForm({
    defaultValues,
    // Run all field validators even when change validation has already failed.
    canSubmitWhenInvalid: true,
    // Submitting is wired up once transfer entries and save actions exist.
    onSubmit: () => undefined,
  });

  return { form };
};
