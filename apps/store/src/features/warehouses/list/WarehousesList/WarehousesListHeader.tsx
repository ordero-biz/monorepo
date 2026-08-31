import { PageHeader, Typography } from '@ordero/ui';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { CreateWarehouseDialogTrigger } from '../CreateWarehouse';

export const WarehousesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Warehouses list</Typography>
        <StoreBreadcrumbs items={[{ id: 'warehouses', label: 'Warehouse' }]} />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateWarehouseDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
