import { PageHeader, Typography } from '@ordero/ui';
import { CreateWarehouseDialogTrigger } from '../CreateWarehouse';

export const WarehousesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Warehouses list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateWarehouseDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
