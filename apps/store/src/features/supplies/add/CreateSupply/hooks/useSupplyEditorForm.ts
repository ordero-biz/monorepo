'use client';

import { useToastManager } from '@ordero/ui';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { createSupply, updateSupply } from '@/lib/client/api/supplies';
import { getSupplyDetailRoute } from '@/lib/client/routes';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { getCreateSupplyData, getUpdateSupplyData } from '../submitData';
import { getSupplyFormDefaults, validateSupplyForm } from '../utils';

type SupplySubmitIntent = 'draft' | 'finalize';

const mapSupplyFieldErrors = (fieldErrors?: Record<string, string>) =>
  fieldErrors
    ? Object.fromEntries(
        Object.entries(fieldErrors).map(([name, message]) => [
          name.replace(/^supplyEntries\.(\d+)\./, 'supplyEntries[$1].'),
          message,
        ])
      )
    : undefined;

export const useSupplyEditorForm = (initialSupply?: SupplyDetails) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { add: addToast } = useToastManager();
  const intentRef = useRef<SupplySubmitIntent>('draft');
  const [submitIntent, setSubmitIntent] = useState<SupplySubmitIntent>('draft');
  const form = useForm({
    defaultValues: getSupplyFormDefaults(initialSupply),
    validationLogic: revalidateLogic(),
    validators: {
      onSubmit: ({ value }) =>
        validateSupplyForm(value, intentRef.current === 'finalize'),
    },
    onSubmitInvalid: ({ formApi }) => {
      void formApi.validate('submit');
    },
    onSubmit: async ({ formApi, value }) => {
      const status =
        intentRef.current === 'finalize'
          ? SUPPLY_STATUS.COMPLETED
          : SUPPLY_STATUS.DRAFT;
      const updateData = initialSupply
        ? getUpdateSupplyData(value, initialSupply, status)
        : null;

      if (initialSupply && !updateData) {
        addToast({ description: 'No changes to save.', type: 'info' });
        return;
      }

      const result = updateData
        ? await updateSupply(updateData)
        : await createSupply(getCreateSupplyData(value, status));

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

      queryClient.setQueryData(
        suppliesQueryKeys.detail(result.data.id),
        result.data
      );
      await queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.list });
      addToast({
        description:
          status === SUPPLY_STATUS.COMPLETED
            ? 'Supply finalized. It can no longer be edited.'
            : initialSupply
              ? 'Supply draft saved.'
              : 'Supply draft created.',
        type: 'success',
      });

      if (!initialSupply) {
        router.replace(getSupplyDetailRoute(result.data.id));
      }
    },
  });

  const submit = (intent: SupplySubmitIntent) => {
    intentRef.current = intent;
    setSubmitIntent(intent);
    void form.handleSubmit();
  };

  return { form, submit, submitIntent };
};
