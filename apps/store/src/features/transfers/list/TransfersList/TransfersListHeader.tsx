'use client';

import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { Button, PageHeader, Typography } from '@/ui/index';
import { transfersRootBreadcrumb } from '../../shared/breadcrumbs';

export const TransfersListHeader = () => {
  const router = useRouter();

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <Typography variant="h5">Transfers list</Typography>
          <AppBreadcrumbs
            items={[
              {
                id: transfersRootBreadcrumb.id,
                label: transfersRootBreadcrumb.label,
              },
            ]}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        <Button
          color="primary"
          onClick={() => router.push(clientRoutes.addTransfer)}
          type="button"
        >
          Add transfer
        </Button>
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
