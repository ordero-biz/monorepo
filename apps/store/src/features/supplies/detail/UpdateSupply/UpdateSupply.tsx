'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { FormConflictResolver } from '@/lib/components/FormConflictResolver';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';
import {
  getSupplyFormDefaults,
  SupplyEditorForm,
} from '../../shared/SupplyEditorForm';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';
import { SupplyReadOnly } from '../SupplyReadOnly';
import { supplyConflictPolicy } from './conflictPolicy';
import { useUpdateSupplyForm } from './hooks/useUpdateSupplyForm';
import type { UpdateSupplyProps } from './types';

export const UpdateSupply = ({ supply }: UpdateSupplyProps) => {
  const queryClient = useQueryClient();
  // The PATCH baseline and expected version must advance together, only after
  // a successful save or an accepted refresh of the editor.
  const [baseline, setBaseline] = useState(supply);
  const { form, submit, pendingIntent } = useUpdateSupplyForm({
    supply: baseline,
    onUpdated: async (updatedSupply) => {
      queryClient.setQueryData<SupplyDetails>(
        suppliesQueryKeys.detail(updatedSupply.id),
        (cachedSupply) =>
          cachedSupply && cachedSupply.version > updatedSupply.version
            ? cachedSupply
            : updatedSupply
      );
      await queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.list });
      form.reset(getSupplyFormDefaults(updatedSupply));
      setBaseline(updatedSupply);
    },
  });
  const isPristine = useStore(form.store, (state) => state.isPristine);

  if (baseline.status === SUPPLY_STATUS.COMPLETED) {
    return <SupplyReadOnly supply={baseline} />;
  }

  return (
    <FormConflictResolver.Provider
      baseline={baseline}
      form={{
        isPristine,
        isSubmitting: pendingIntent !== null,
        getValues: () => form.state.values,
        reset: (defaults) => form.reset(defaults),
        setFieldValue: (field, value) => {
          form.setFieldValue(field, value, {
            dontRunListeners: true,
            dontValidate: true,
          });
        },
      }}
      latest={supply}
      onBaselineChange={setBaseline}
      policy={supplyConflictPolicy}
    >
      <div className="flex flex-col gap-[var(--space-2)]">
        <PageHeader.Root>
          <PageHeader.Left>
            <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
              <div className="flex min-w-0 items-center gap-[var(--space-1)]">
                <Typography variant="h5">
                  {baseline.supplyNumber || 'Supply'}
                </Typography>
                <SupplyStatusChip status={baseline.status} />
              </div>
              <AppBreadcrumbs
                items={[
                  suppliesRootBreadcrumb,
                  {
                    id: 'current-supply',
                    label: baseline.supplyNumber || 'Supply',
                  },
                ]}
              />
            </div>
          </PageHeader.Left>
        </PageHeader.Root>
        <SupplyEditorForm
          form={form}
          pendingIntent={pendingIntent}
          submit={submit}
        />
      </div>
    </FormConflictResolver.Provider>
  );
};
