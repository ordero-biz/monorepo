'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateUnitOfMeasurementDialog } from './ActivateUnitOfMeasurementDialog';
import type { UnitOfMeasurementDetailInfoProps } from './types';

type ActivateUnitOfMeasurementDialogTriggerProps =
  UnitOfMeasurementDetailInfoProps & {
    onUpdated: () => Promise<void> | void;
  };

export const ActivateUnitOfMeasurementDialogTrigger = ({
  onUpdated,
  unitOfMeasurement,
}: ActivateUnitOfMeasurementDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        size="m"
        type="button"
      >
        Publish
      </Button>
      <ActivateUnitOfMeasurementDialog
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
        unitOfMeasurement={unitOfMeasurement}
      />
    </>
  );
};
