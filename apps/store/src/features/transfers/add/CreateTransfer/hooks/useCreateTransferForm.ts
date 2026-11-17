'use client';

import { useForm } from '@tanstack/react-form';
import type { UseCreateTransferFormArgs } from '../types';

export const useCreateTransferForm = ({
  defaultValues,
}: UseCreateTransferFormArgs) => {
  const form = useForm({
    defaultValues,
    // Run all field validators even when change validation has already failed.
    canSubmitWhenInvalid: true,
    // Saving the transfer is wired up together with the create/update requests.
    onSubmit: () => undefined,
  });

  return { form };
};
