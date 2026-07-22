import { Menu, PageHeader, Typography } from '@/ui/index';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { UpdateSupplierDialog } from '../UpdateSupplier/UpdateSupplierDialog';
import type { SupplierDetailHeaderProps } from './types';

export const SupplierDetailHeader = ({
  onUpdated,
  supplier,
}: SupplierDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{supplier.name}</Typography>
      </PageHeader.Left>
      <PageHeader.Right>
        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${supplier.name}`}
            appearance="iconButton"
            size="s"
            title={`Actions for ${supplier.name}`}
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
                  Edit supplier
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <UpdateSupplierDialog
          onOpenChange={setIsUpdateDialogOpen}
          onUpdated={onUpdated}
          open={isUpdateDialogOpen}
          supplier={supplier}
        />
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
