'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getSupplyDetailRoute } from '@/lib/client/routes';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';
import {
  SupplyEditorForm,
  useSupplyEditorForm,
} from '../../shared/SupplyEditorForm';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';
import type { CreateSupplyProps } from './types';

export const CreateSupply = ({ initialSupply }: CreateSupplyProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { form, submit, pendingIntent } = useSupplyEditorForm({
    initialSupply,
    onSaved: async (supply) => {
      queryClient.setQueryData(suppliesQueryKeys.detail(supply.id), supply);
      await queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.list });

      if (!initialSupply) {
        router.replace(getSupplyDetailRoute(supply.id));
      }
    },
  });

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
            <div className="flex min-w-0 items-center gap-[var(--space-1)]">
              <Typography variant="h5">
                {initialSupply
                  ? initialSupply.supplyNumber || 'Supply'
                  : 'Create supply'}
              </Typography>
              {initialSupply ? (
                <SupplyStatusChip status={initialSupply.status} />
              ) : null}
            </div>
            <AppBreadcrumbs
              items={[
                suppliesRootBreadcrumb,
                {
                  id: 'current-supply',
                  label: initialSupply?.supplyNumber || 'New supply',
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
