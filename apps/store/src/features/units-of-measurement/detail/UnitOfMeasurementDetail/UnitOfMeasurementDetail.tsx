'use client';

import { useUnitOfMeasurementQuery } from '@/lib/hooks/units-of-measurement/useUnitOfMeasurementQuery';
import {
  Button,
  Card,
  Menu,
  PageHeader,
  Typography,
} from '@ordero/ui';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { UpdateUnitOfMeasurementDialogTrigger } from '../UpdateUnitOfMeasurement';
import { DeleteUnitOfMeasurementDialog } from '../DeleteUnitOfMeasurement';
import type { UnitOfMeasurementDetailProps } from './types';
import { UnitOfMeasurementDetailInfo } from './UnitOfMeasurementDetailInfo';

export const UnitOfMeasurementDetail = ({
  unitOfMeasurementId,
}: UnitOfMeasurementDetailProps) => {
  const unitOfMeasurementQuery = useUnitOfMeasurementQuery(unitOfMeasurementId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <Typography variant="h5">
            {unitOfMeasurementQuery.data.name}
          </Typography>
          <div>
            <UpdateUnitOfMeasurementDialogTrigger
              onUpdated={async () => {
                await unitOfMeasurementQuery.refetch();
              }}
              unitOfMeasurement={unitOfMeasurementQuery.data}
            />
          </div>
        </PageHeader.Left>
        <PageHeader.Right>
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

          <DeleteUnitOfMeasurementDialog
            onOpenChange={setIsDeleteDialogOpen}
            open={isDeleteDialogOpen}
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
