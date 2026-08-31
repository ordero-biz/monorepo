import { StoreBreadcrumbs } from '@/features/app-shell';
import { CreateSupplierDialogTrigger } from '@/features/suppliers/list/CreateSupplier';
import { clientRoutes } from '@/lib/client/routes';
import { PageHeader, Typography } from '@/ui/index';

export const SuppliersListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Suppliers list</Typography>
        <StoreBreadcrumbs
          items={[
            {
              href: clientRoutes.products,
              id: 'product',
              label: 'Product',
            },
            { id: 'suppliers', label: 'Suppliers' },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateSupplierDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
