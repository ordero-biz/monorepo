import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { clientRoutes } from '@/lib/client/routes';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { Menu, PageHeader, Typography } from '@/ui/index';
import { SupplierStatusChip } from '../../shared/SupplierStatusChip';
import { UpdateSupplierDialog } from '../UpdateSupplier/UpdateSupplierDialog';
import { ActivateSupplierDialogTrigger } from './ActivateSupplierDialogTrigger';
import type { SupplierDetailHeaderProps } from './types';

export const SupplierDetailHeader = ({
  onUpdated,
  supplier,
}: SupplierDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isSupplierActive = supplier.status === SUPPLIER_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <div className="flex min-w-0 items-center gap-[var(--space-1)]">
            <Typography variant="h5">{supplier.name}</Typography>
            <SupplierStatusChip status={supplier.status} />
          </div>
          <StoreBreadcrumbs
            items={[
              {
                href: clientRoutes.products,
                id: 'product',
                label: 'Product',
              },
              {
                href: clientRoutes.suppliers,
                id: 'suppliers',
                label: 'Suppliers',
              },
              { id: 'current-supplier', label: supplier.name },
            ]}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        {!isSupplierActive ? (
          <ActivateSupplierDialogTrigger
            onUpdated={onUpdated}
            supplier={supplier}
          />
        ) : null}
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
