'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateSupplierDialog } from './ActivateSupplierDialog';
import type { SupplierDetailHeaderProps } from './types';

type ActivateSupplierDialogTriggerProps = SupplierDetailHeaderProps;

export const ActivateSupplierDialogTrigger = ({
  supplier,
  onUpdated,
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
        onUpdated={onUpdated}
        open={open}
        supplier={supplier}
      />
    </>
  );
};
