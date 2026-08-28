'use client';

import { Button, Card, Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import { useUnitOfMeasurementQuery } from '@/lib/hooks/units-of-measurement/useUnitOfMeasurementQuery';
import { DeleteUnitsOfMeasurementDialog } from '../../shared';
import { UnitOfMeasurementStatusChip } from '../../shared/UnitOfMeasurementStatusChip';
import { UpdateUnitOfMeasurementDialog } from '../UpdateUnitOfMeasurement/UpdateUnitOfMeasurementDialog';
import { ActivateUnitOfMeasurementDialogTrigger } from './ActivateUnitOfMeasurementDialogTrigger';
import type { UnitOfMeasurementDetailProps } from './types';
import { UnitOfMeasurementDetailInfo } from './UnitOfMeasurementDetailInfo';

export const UnitOfMeasurementDetail = ({
  unitOfMeasurementId,
}: UnitOfMeasurementDetailProps) => {
  const router = useRouter();
  const unitOfMeasurementQuery = useUnitOfMeasurementQuery(unitOfMeasurementId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  if (unitOfMeasurementQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading unit of measurement...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (unitOfMeasurementQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this unit of measurement right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => unitOfMeasurementQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  const isUnitOfMeasurementActive =
    unitOfMeasurementQuery.data.status === UNIT_OF_MEASUREMENT_STATUS.ACTIVE;

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <Typography variant="h5">
            {unitOfMeasurementQuery.data.name}
          </Typography>
          <UnitOfMeasurementStatusChip
            status={unitOfMeasurementQuery.data.status}
          />
        </PageHeader.Left>
        <PageHeader.Right>
          {!isUnitOfMeasurementActive ? (
            <ActivateUnitOfMeasurementDialogTrigger
              onUpdated={async () => {
                await unitOfMeasurementQuery.refetch();
              }}
              unitOfMeasurement={unitOfMeasurementQuery.data}
            />
          ) : null}
          <Menu.Root>
            <Menu.Trigger
              aria-label={`Actions for ${unitOfMeasurementQuery.data.name}`}
              appearance="iconButton"
              size="s"
              title={`Actions for ${unitOfMeasurementQuery.data.name}`}
            >
              <EllipsisVertical aria-hidden="true" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner align="end">
                <Menu.Popup>
                  {!isUnitOfMeasurementActive ? (
                    <Menu.Item onClick={() => setIsUpdateDialogOpen(true)}>
                      <Pencil
                        aria-hidden="true"
                        className="size-[var(--icon-button-xs-icon)]"
                      />
                      Edit unit of measurement
                    </Menu.Item>
                  ) : null}
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
            onDeleted={async () => {
              router.push(clientRoutes.unitsOfMeasurement);
            }}
            onOpenChange={setIsDeleteDialogOpen}
            open={isDeleteDialogOpen}
            unitsOfMeasurement={[unitOfMeasurementQuery.data]}
          />
          <UpdateUnitOfMeasurementDialog
            onOpenChange={setIsUpdateDialogOpen}
            onUpdated={async () => {
              await unitOfMeasurementQuery.refetch();
            }}
            open={isUpdateDialogOpen}
            unitOfMeasurement={unitOfMeasurementQuery.data}
          />
        </PageHeader.Right>
      </PageHeader.Root>
      <UnitOfMeasurementDetailInfo
        unitOfMeasurement={unitOfMeasurementQuery.data}
      />
    </div>
  );
};
