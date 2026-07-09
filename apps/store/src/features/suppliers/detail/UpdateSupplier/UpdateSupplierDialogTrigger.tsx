'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { Supplier } from '@/lib/domain/suppliers';
import { UpdateSupplierDialog } from './UpdateSupplierDialog';

type UpdateSupplierDialogTriggerProps = {
  onUpdated: () => Promise<void> | void;
  supplier: Supplier;
};

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
        size="s"
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
