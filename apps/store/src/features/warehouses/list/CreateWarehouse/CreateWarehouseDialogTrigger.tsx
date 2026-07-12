'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateWarehouseDialog } from './CreateWarehouseDialog';

export const CreateWarehouseDialogTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Add Warehouse
      </Button>

      <CreateWarehouseDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
