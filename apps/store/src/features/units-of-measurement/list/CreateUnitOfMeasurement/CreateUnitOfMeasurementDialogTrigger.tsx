'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateUnitOfMeasurementDialog } from './CreateUnitOfMeasurementDialog';

export const CreateUnitOfMeasurementDialogTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Add unit of measurement
      </Button>

      <CreateUnitOfMeasurementDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
