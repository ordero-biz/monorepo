'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getSupplyDetailRoute } from '@/lib/client/routes';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';
import { SupplyEditorForm } from '../../shared/SupplyEditorForm';
import { useCreateSupplyForm } from './hooks/useCreateSupplyForm';

export const CreateSupply = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { form, submit, pendingIntent } = useCreateSupplyForm({
    onCreated: async (supply) => {
      queryClient.setQueryData(suppliesQueryKeys.detail(supply.id), supply);
      await queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.list });

      router.replace(getSupplyDetailRoute(supply.id));
    },
  });

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
            <Typography variant="h5">Create supply</Typography>
            <AppBreadcrumbs
              items={[
                suppliesRootBreadcrumb,
                {
                  id: 'current-supply',
                  label: 'New supply',
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
