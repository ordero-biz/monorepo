'use client';

import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { Button, PageHeader, Typography } from '@/ui/index';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';

export const SuppliesListHeader = () => {
  const router = useRouter();

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <Typography variant="h5">Supplies list</Typography>
          <AppBreadcrumbs
            items={[
              {
                id: suppliesRootBreadcrumb.id,
                label: suppliesRootBreadcrumb.label,
              },
            ]}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        <Button
          color="primary"
          onClick={() => router.push(clientRoutes.addSupply)}
          type="button"
        >
          Add supply
        </Button>
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
