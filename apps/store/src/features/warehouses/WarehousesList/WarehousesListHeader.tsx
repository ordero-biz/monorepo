import { PageHeader, Typography } from '@ordero/ui';
import { CreateWarehouseDialog } from '../CreateWarehouseDialog/CreateWarehouseDialog';

export const WarehousesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Warehouses list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateWarehouseDialog />
    </PageHeader.Right>
  </PageHeader.Root>
);
