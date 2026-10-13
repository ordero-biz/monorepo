'use client';

import { useToastManager } from '@ordero/ui';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { submitCreateSupplyAction } from '../submitCreateSupplyAction';
import { submitUpdateSupplyAction } from '../submitUpdateSupplyAction';
import type { SupplySubmitIntent } from '../types';
import { getSupplyFormDefaults, validateSupplyForm } from '../utils';

type UseSupplyEditorFormArgs = {
  initialSupply?: SupplyDetails;
  onSaved: (supply: SupplyDetails) => Promise<void> | void;
};

const mapSupplyFieldErrors = (fieldErrors?: Record<string, string>) =>
  fieldErrors
    ? Object.fromEntries(
        Object.entries(fieldErrors).map(([name, message]) => [
          name.replace(/^supplyEntries\.(\d+)\./, 'supplyEntries[$1].'),
          message,
        ])
      )
    : undefined;

export const useSupplyEditorForm = ({
  initialSupply,
  onSaved,
}: UseSupplyEditorFormArgs) => {
  const { add: addToast } = useToastManager();
  const intentRef = useRef<SupplySubmitIntent>('draft');
  const [pendingIntent, setPendingIntent] = useState<SupplySubmitIntent | null>(
    null
  );
  const form = useForm({
    defaultValues: getSupplyFormDefaults(initialSupply),
    validationLogic: revalidateLogic(),
    validators: {
      onSubmit: ({ value }) =>
        validateSupplyForm(value, intentRef.current === 'finalize'),
    },
    onSubmitInvalid: ({ formApi }) => formApi.validate('submit'),
    onSubmit: async ({ formApi, value }) => {
      const status =
        intentRef.current === 'finalize'
          ? SUPPLY_STATUS.COMPLETED
          : SUPPLY_STATUS.DRAFT;
      const result = initialSupply
        ? await submitUpdateSupplyAction({ value, initialSupply, status })
        : await submitCreateSupplyAction({ value, status });

      if (!result) {
        addToast({ description: 'No changes to save.', type: 'info' });
        return;
      }

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: mapSupplyFieldErrors(result.error.fieldErrors),
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
            : initialSupply
              ? 'Supply draft saved.'
              : 'Supply draft created.',
        type: 'success',
      });

      await onSaved(result.data);
    },
  });

  const submit = async (intent: SupplySubmitIntent) => {
    if (form.state.isSubmitting) {
      return;
    }

    intentRef.current = intent;
    setPendingIntent(intent);
    try {
      await form.handleSubmit();
    } finally {
      setPendingIntent(null);
    }
  };

  return { form, submit, pendingIntent };
};
