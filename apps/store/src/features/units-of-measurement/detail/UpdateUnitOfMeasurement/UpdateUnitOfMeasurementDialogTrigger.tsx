'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { UpdateUnitOfMeasurementDialogTriggerProps } from './types';
import { UpdateUnitOfMeasurementDialog } from './UpdateUnitOfMeasurementDialog';

export const UpdateUnitOfMeasurementDialogTrigger = ({
  onUpdated,
  unitOfMeasurement,
}: UpdateUnitOfMeasurementDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`Edit ${unitOfMeasurement.name}`}
        onClick={() => setOpen(true)}
        size="xs"
        title={`Edit ${unitOfMeasurement.name}`}
      >
        <Pencil aria-hidden="true" />
      </IconButton>

      <UpdateUnitOfMeasurementDialog
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
        unitOfMeasurement={unitOfMeasurement}
      />
    </>
  );
};
