import { Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { warehousesRootBreadcrumb } from '../../shared/breadcrumbs';
import { WarehouseStatusChip } from '../../shared/WarehouseStatusChip';
import { UpdateWarehouseDialog } from '../UpdateWarehouse/UpdateWarehouseDialog';
import { ActivateWarehouseDialogTrigger } from './ActivateWarehouseDialogTrigger';
import type { WarehouseDetailHeaderProps } from './types';

export const WarehouseDetailHeader = ({
  onUpdated,
  warehouse,
}: WarehouseDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isWarehouseActive = warehouse.status === WAREHOUSE_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <div className="flex min-w-0 items-center gap-[var(--space-1)]">
            <Typography variant="h5">{warehouse.name}</Typography>
            <WarehouseStatusChip status={warehouse.status} />
          </div>
          <StoreBreadcrumbs
            items={[
              warehousesRootBreadcrumb,
              { id: 'current-warehouse', label: warehouse.name },
            ]}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        {!isWarehouseActive ? (
          <ActivateWarehouseDialogTrigger
            onUpdated={onUpdated}
            warehouse={warehouse}
          />
        ) : null}
        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${warehouse.name}`}
            appearance="iconButton"
            size="s"
            title={`Actions for ${warehouse.name}`}
          >
            <EllipsisVertical aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                <Menu.Item onClick={() => setIsUpdateDialogOpen(true)}>
                  <Pencil
                    aria-hidden="true"
                    className="size-[var(--icon-button-xs-icon)]"
                  />
                  Edit warehouse
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <UpdateWarehouseDialog
          onOpenChange={setIsUpdateDialogOpen}
          onUpdated={onUpdated}
          open={isUpdateDialogOpen}
          warehouse={warehouse}
        />
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
