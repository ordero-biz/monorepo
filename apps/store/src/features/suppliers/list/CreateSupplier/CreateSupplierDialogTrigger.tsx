'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateSupplierDialog } from './CreateSupplierDialog';

export const CreateSupplierDialogTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Add supplier
      </Button>

      <CreateSupplierDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
