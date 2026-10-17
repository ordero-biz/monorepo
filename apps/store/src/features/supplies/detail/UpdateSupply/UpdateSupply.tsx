'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';
import { SupplyEditorForm } from '../../shared/SupplyEditorForm';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';
import { useUpdateSupplyForm } from './hooks/useUpdateSupplyForm';
import type { UpdateSupplyProps } from './types';

export const UpdateSupply = ({ supply }: UpdateSupplyProps) => {
  const queryClient = useQueryClient();
  const { form, submit, pendingIntent } = useUpdateSupplyForm({
    supply,
    onUpdated: async (updatedSupply) => {
      queryClient.setQueryData(
        suppliesQueryKeys.detail(updatedSupply.id),
        updatedSupply
      );
      await queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.list });
    },
  });

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
            <div className="flex min-w-0 items-center gap-[var(--space-1)]">
              <Typography variant="h5">
                {supply.supplyNumber || 'Supply'}
              </Typography>
              <SupplyStatusChip status={supply.status} />
            </div>
            <AppBreadcrumbs
              items={[
                suppliesRootBreadcrumb,
                {
                  id: 'current-supply',
                  label: supply.supplyNumber || 'Supply',
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
  );
};
