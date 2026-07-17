import { UpdateWarehouseDialogTrigger } from '@/features/warehouses/detail/UpdateWarehouse';
import { PageHeader, Typography } from '@/ui/index';
import type { WarehouseDetailHeaderProps } from './types';

export const WarehouseDetailHeader = ({
  onUpdated,
  warehouse,
}: WarehouseDetailHeaderProps) => {
  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{warehouse.name}</Typography>
        <div>
          <UpdateWarehouseDialogTrigger
            onUpdated={onUpdated}
            warehouse={warehouse}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right />
    </PageHeader.Root>
  );
};
