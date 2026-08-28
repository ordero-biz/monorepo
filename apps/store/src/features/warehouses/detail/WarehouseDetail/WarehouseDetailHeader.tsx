import { Chip, Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
import { UpdateWarehouseDialog } from '../UpdateWarehouse/UpdateWarehouseDialog';
import { ActivateWarehouseDialogTrigger } from './ActivateWarehouseDialogTrigger';
import type { WarehouseDetailHeaderProps } from './types';

const statusLabels = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
} as const;

export const WarehouseDetailHeader = ({
  onUpdated,
  warehouse,
}: WarehouseDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isWarehouseActive = warehouse.status === WAREHOUSE_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{warehouse.name}</Typography>
        {warehouse.status ? (
          <Chip
            color={isWarehouseActive ? 'primary' : 'warning'}
            size="s"
            variant="soft"
          >
            {statusLabels[warehouse.status]}
          </Chip>
        ) : null}
      </PageHeader.Left>
      {!isWarehouseActive ? (
        <PageHeader.Right>
          <ActivateWarehouseDialogTrigger
            onUpdated={onUpdated}
            warehouse={warehouse}
          />
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
      ) : null}
    </PageHeader.Root>
  );
};
