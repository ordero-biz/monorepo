'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateUnitOfMeasurementDialog } from './ActivateUnitOfMeasurementDialog';
import type { ActivateUnitOfMeasurementDialogTriggerProps } from './types';

export const ActivateUnitOfMeasurementDialogTrigger = ({
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
        open={open}
        unitOfMeasurement={unitOfMeasurement}
      />
    </>
  );
};
