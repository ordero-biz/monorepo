import { PageHeader, Typography } from '@ordero/ui';
import { CreateSupplierDialog } from '../CreateSupplierDialog/CreateSupplierDialog';

export const SuppliersListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Suppliers list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateSupplierDialog />
    </PageHeader.Right>
  </PageHeader.Root>
);
