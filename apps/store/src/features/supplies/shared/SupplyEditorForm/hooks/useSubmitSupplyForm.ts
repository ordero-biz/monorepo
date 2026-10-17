'use client';

import type { ApiResult } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails, SupplyStatus } from '@/lib/domain/supplies/types';
import type { SupplyFormValues, SupplySubmitIntent } from '../types';
import { isBlankSupplyEntry } from '../utils';

type UseSubmitSupplyFormArgs = {
  defaultValues: SupplyFormValues;
  draftSuccessMessage: string;
  submitAction: (args: {
    value: SupplyFormValues;
    status: SupplyStatus;
  }) => Promise<ApiResult<SupplyDetails> | null>;
  onSaved: (supply: SupplyDetails) => Promise<void> | void;
};

const defaultSubmitMeta: { intent: SupplySubmitIntent } = { intent: 'draft' };

const mapSupplyFieldErrors = (fieldErrors?: Record<string, string>) =>
  fieldErrors
    ? Object.fromEntries(
        Object.entries(fieldErrors).map(([name, message]) => [
          name
            .replace(/^(supplier|warehouse)Id$/, '$1')
            .replace(/^supplyEntries\.(\d+)\./, 'supplyEntries[$1].')
            .replace(
              /^(supplyEntries\[\d+\])\.(productVariant|unitOfMeasurement)Id$/,
              '$1.$2'
            ),
          message,
        ])
      )
    : undefined;

export const useSubmitSupplyForm = ({
  defaultValues,
  draftSuccessMessage,
  submitAction,
  onSaved,
}: UseSubmitSupplyFormArgs) => {
  const { add: addToast } = useToastManager();
  const [pendingIntent, setPendingIntent] = useState<SupplySubmitIntent | null>(
    null
  );
  const form = useForm({
    defaultValues,
    // Run all field validators even when change validation has already failed.
    canSubmitWhenInvalid: true,
    onSubmitMeta: defaultSubmitMeta,
    onSubmit: async ({ formApi, value, meta }) => {
      if (
        meta.intent === 'finalize' &&
        value.supplyEntries.every(isBlankSupplyEntry)
      ) {
        addToast({
          description: 'Add at least one product before finalizing.',
          type: 'error',
        });
        return;
      }

      const status =
        meta.intent === 'finalize'
          ? SUPPLY_STATUS.COMPLETED
          : SUPPLY_STATUS.DRAFT;
      const result = await submitAction({ value, status });

      if (!result) {
        addToast({ description: 'No changes to save.', type: 'info' });
        return;
      }

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: mapSupplyFieldErrors(result.error.fieldErrors) ?? {},
          },
        });
        addToast({
          description: result.error.message || 'Could not save the supply.',
          type: 'error',
        });
        return;
      }

      addToast({
        description:
          status === SUPPLY_STATUS.COMPLETED
            ? 'Supply finalized. It can no longer be edited.'
            : draftSuccessMessage,
        type: 'success',
      });

      await onSaved(result.data);
    },
  });

  const submit = async (intent: SupplySubmitIntent) => {
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
