import { PageHeader, Typography } from '@ordero/ui';
import { CreateSupplierDialogTrigger } from '../CreateSupplierDialog/CreateSupplierDialogTrigger';

export const SuppliersListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Suppliers list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateSupplierDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
