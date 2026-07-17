'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { UpdateSupplierDialogTriggerProps } from './types';
import { UpdateSupplierDialog } from './UpdateSupplierDialog';

export const UpdateSupplierDialogTrigger = ({
  onUpdated,
  supplier,
}: UpdateSupplierDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`Edit ${supplier.name}`}
        onClick={() => setOpen(true)}
        size="xs"
        title={`Edit ${supplier.name}`}
      >
        <Pencil aria-hidden="true" />
      </IconButton>

      <UpdateSupplierDialog
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
        supplier={supplier}
      />
    </>
  );
};
