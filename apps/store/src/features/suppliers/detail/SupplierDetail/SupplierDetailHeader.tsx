import { UpdateSupplierDialogTrigger } from '@/features/suppliers/detail/UpdateSupplier';
import { PageHeader, Typography } from '@/ui/index';
import type { SupplierDetailHeaderProps } from './types';

export const SupplierDetailHeader = ({
  onUpdated,
  supplier,
}: SupplierDetailHeaderProps) => {
  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{supplier.name}</Typography>
        <div>
          <UpdateSupplierDialogTrigger
            onUpdated={onUpdated}
            supplier={supplier}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right></PageHeader.Right>
    </PageHeader.Root>
  );
};
