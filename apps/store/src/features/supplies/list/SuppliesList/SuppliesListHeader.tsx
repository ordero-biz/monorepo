import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { PageHeader, Typography } from '@/ui/index';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';

export const SuppliesListHeader = () => (
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
  </PageHeader.Root>
);
