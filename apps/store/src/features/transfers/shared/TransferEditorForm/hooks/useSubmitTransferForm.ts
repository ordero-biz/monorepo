'use client';

import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferSubmitIntent, UseSubmitTransferFormArgs } from '../types';
import { isBlankTransferEntry } from '../utils/entries';
import { mapTransferFieldErrors } from '../utils/mapTransferFieldErrors';

type TransferSubmitMeta = { intent: TransferSubmitIntent };

const defaultSubmitMeta: TransferSubmitMeta = { intent: 'draft' };

export const useSubmitTransferForm = ({
  defaultValues,
  draftSuccessMessage,
  submitAction,
  onSaved,
}: UseSubmitTransferFormArgs) => {
  const { add: addToast } = useToastManager();
  const [pendingIntent, setPendingIntent] =
    useState<TransferSubmitIntent | null>(null);
  const form = useForm({
    defaultValues,
    onSubmitMeta: defaultSubmitMeta,
    onSubmit: async ({ formApi, value, meta }) => {
      if (
        meta.intent !== 'draft' &&
        value.transferEntries.every(isBlankTransferEntry)
      ) {
        addToast({
          description: 'Add at least one product before transferring.',
          type: 'error',
        });
        return;
      }

      const status =
        meta.intent === 'transfer'
          ? TRANSFER_STATUS.IN_TRANSIT
          : TRANSFER_STATUS.DRAFT;
      const submittedEntryIds = value.transferEntries
        .filter((entry) => !isBlankTransferEntry(entry))
        .map((entry) => entry.clientId);
      const result = await submitAction({ value, status });

      if (!result) {
        addToast({ description: 'No changes to save.', type: 'info' });
        return;
      }

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: mapTransferFieldErrors({
              fieldErrors: result.error.fieldErrors,
              submittedEntryIds,
              currentEntries: formApi.state.values.transferEntries,
            }),
          },
        });
        addToast({
          description: result.error.message || 'Could not save the transfer.',
          type: 'error',
        });
        return;
      }

      addToast({
        description:
          status === TRANSFER_STATUS.IN_TRANSIT
            ? 'Transfer started. Products are in transit.'
            : draftSuccessMessage,
        type: 'success',
      });

      await onSaved(result.data);
    },
  });

  const submit = async (intent: TransferSubmitIntent) => {
    if (form.state.isSubmitting) {
      return;
    }

    setPendingIntent(intent);
    try {
      await form.handleSubmit({ intent });
    } finally {
      setPendingIntent(null);
    }
  };

  return { form, submit, pendingIntent };
};
