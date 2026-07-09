import { CreateSupplierDialogTrigger } from '@/features/suppliers/list/CreateSupplier';
import { PageHeader, Typography } from '@/ui/index';

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
