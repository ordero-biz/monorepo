'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateSupplierDialog } from './ActivateSupplierDialog';
import type { ActivateSupplierDialogTriggerProps } from './types';

export const ActivateSupplierDialogTrigger = ({
  supplier,
}: ActivateSupplierDialogTriggerProps) => {
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

      <ActivateSupplierDialog
        onOpenChange={setOpen}
        open={open}
        supplier={supplier}
      />
    </>
  );
};
