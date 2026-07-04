'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateSupplierDialog } from './CreateSupplierDialog';

export const CreateSupplierDialogTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Add Supplier
      </Button>

      <CreateSupplierDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
