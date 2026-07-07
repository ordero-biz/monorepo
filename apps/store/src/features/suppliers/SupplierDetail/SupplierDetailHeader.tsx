import { PageHeader, Typography } from '@ordero/ui';
import type { Supplier } from '@/lib/domain/suppliers';
import { UpdateSupplierDialogTrigger } from '../UpdateSupplierDialog/UpdateSupplierDialogTrigger';

type SupplierDetailHeaderProps = {
  onUpdated: () => Promise<void> | void;
  supplier: Supplier;
};

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
