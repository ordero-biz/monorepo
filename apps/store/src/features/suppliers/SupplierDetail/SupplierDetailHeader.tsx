import { PageHeader, Typography } from '@ordero/ui';
import type { Supplier } from '@/lib/domain/suppliers';

type SupplierDetailHeaderProps = {
  supplier: Supplier;
};

export const SupplierDetailHeader = ({
  supplier,
}: SupplierDetailHeaderProps) => {
  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{supplier.name}</Typography>
      </PageHeader.Left>
      <PageHeader.Right></PageHeader.Right>
    </PageHeader.Root>
  );
};
