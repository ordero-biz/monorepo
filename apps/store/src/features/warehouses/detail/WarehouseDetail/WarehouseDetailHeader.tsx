import { Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { UpdateWarehouseDialog } from '../UpdateWarehouse/UpdateWarehouseDialog';
import type { WarehouseDetailHeaderProps } from './types';

export const WarehouseDetailHeader = ({
  onUpdated,
  warehouse,
}: WarehouseDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{warehouse.name}</Typography>
      </PageHeader.Left>
      <PageHeader.Right>
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
