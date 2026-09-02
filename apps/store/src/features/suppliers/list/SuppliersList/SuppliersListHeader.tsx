import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { CreateSupplierDialogTrigger } from '@/features/suppliers/list/CreateSupplier';
import { PageHeader, Typography } from '@/ui/index';
import { suppliersRootBreadcrumb } from '../../shared/breadcrumbs';

export const SuppliersListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Suppliers list</Typography>
        <AppBreadcrumbs
          items={[
            {
              id: suppliersRootBreadcrumb.id,
              label: suppliersRootBreadcrumb.label,
            },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateSupplierDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
