'use client';

import { Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { clientRoutes } from '@/lib/client/routes';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { DeleteUnitsOfMeasurementDialog } from '../../shared';
import { UnitOfMeasurementStatusChip } from '../../shared/UnitOfMeasurementStatusChip';
import { UpdateUnitOfMeasurementDialog } from '../UpdateUnitOfMeasurement/UpdateUnitOfMeasurementDialog';
import { ActivateUnitOfMeasurementDialogTrigger } from './ActivateUnitOfMeasurementDialogTrigger';
import type { UnitOfMeasurementDetailHeaderProps } from './types';

export const UnitOfMeasurementDetailHeader = ({
  onDeleted,
  onUpdated,
  unitOfMeasurement,
}: UnitOfMeasurementDetailHeaderProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isUnitOfMeasurementActive =
    unitOfMeasurement.status === UNIT_OF_MEASUREMENT_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <Typography variant="h5">{unitOfMeasurement.name}</Typography>
          <StoreBreadcrumbs
            items={[
              {
                href: clientRoutes.products,
                id: 'product',
                label: 'Product',
              },
              {
                href: clientRoutes.unitsOfMeasurement,
                id: 'units-of-measurement',
                label: 'Units of measurement',
              },
              {
                id: 'current-unit-of-measurement',
                label: unitOfMeasurement.name,
              },
            ]}
          />
        </div>
        <UnitOfMeasurementStatusChip status={unitOfMeasurement.status} />
      </PageHeader.Left>
      <PageHeader.Right>
        {!isUnitOfMeasurementActive ? (
          <ActivateUnitOfMeasurementDialogTrigger
            onUpdated={onUpdated}
            unitOfMeasurement={unitOfMeasurement}
          />
        ) : null}
        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${unitOfMeasurement.name}`}
            appearance="iconButton"
            size="s"
            title={`Actions for ${unitOfMeasurement.name}`}
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
                  Edit unit of measurement
                </Menu.Item>
                <Menu.Item
                  color="error"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2
                    aria-hidden="true"
                    className="size-[var(--icon-button-xs-icon)]"
                  />
                  Delete unit of measurement
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <DeleteUnitsOfMeasurementDialog
          onDeleted={onDeleted}
          onOpenChange={setIsDeleteDialogOpen}
          open={isDeleteDialogOpen}
          unitsOfMeasurement={[unitOfMeasurement]}
        />
        <UpdateUnitOfMeasurementDialog
          onOpenChange={setIsUpdateDialogOpen}
          onUpdated={onUpdated}
          open={isUpdateDialogOpen}
          unitOfMeasurement={unitOfMeasurement}
        />
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
