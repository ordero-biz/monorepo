'use client';

import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferSubmitIntent, UseCreateTransferFormArgs } from '../types';
import { isBlankTransferEntry } from '../utils/entries';
import { getCreateTransferData } from '../utils/getCreateData';
import { mapTransferFieldErrors } from '../utils/mapTransferFieldErrors';
import { submitCreateTransfer } from '../utils/submitAction';

// `validate` checks the form before the transfer confirmation opens; it sends nothing.
type TransferSubmitMeta = { intent: TransferSubmitIntent | 'validate' };

const defaultSubmitMeta: TransferSubmitMeta = { intent: 'draft' };

export const useCreateTransferForm = ({
  defaultValues,
  onCreated,
}: UseCreateTransferFormArgs) => {
  const { add: addToast } = useToastManager();
  const [pendingIntent, setPendingIntent] =
    useState<TransferSubmitIntent | null>(null);
  const isTransferValid = useRef(false);

  const form = useForm({
    defaultValues,
    // Run all field validators even when change validation has already failed.
    canSubmitWhenInvalid: true,
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

      if (meta.intent === 'validate') {
        isTransferValid.current = true;
        return;
      }

      const status =
        meta.intent === 'transfer'
          ? TRANSFER_STATUS.IN_TRANSIT
          : TRANSFER_STATUS.DRAFT;
      const submittedEntryIds = value.transferEntries
        .filter((entry) => !isBlankTransferEntry(entry))
        .map((entry) => entry.clientId);
      const result = await submitCreateTransfer(
        getCreateTransferData(value, status)
      );

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
            : 'Transfer draft created.',
        type: 'success',
      });

      await onCreated(result.data);
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

  /** Validates like a submit, so invalid fields show their errors. */
  const validateTransfer = async () => {
    if (form.state.isSubmitting) {
      return false;
    }

    isTransferValid.current = false;
    await form.handleSubmit({ intent: 'validate' });
    return isTransferValid.current;
  };

  return { form, submit, validateTransfer, pendingIntent };
};
