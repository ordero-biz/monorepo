import { PageHeader, Typography } from '@ordero/ui';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { warehousesRootBreadcrumb } from '../../shared/breadcrumbs';
import { CreateWarehouseDialogTrigger } from '../CreateWarehouse';

export const WarehousesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Warehouses list</Typography>
        <StoreBreadcrumbs
          items={[
            {
              id: warehousesRootBreadcrumb.id,
              label: warehousesRootBreadcrumb.label,
            },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateWarehouseDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
