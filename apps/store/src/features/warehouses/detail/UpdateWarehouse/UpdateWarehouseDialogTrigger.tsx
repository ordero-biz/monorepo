'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { UpdateWarehouseDialogTriggerProps } from './types';
import { UpdateWarehouseDialog } from './UpdateWarehouseDialog';

export const UpdateWarehouseDialogTrigger = ({
  onUpdated,
  warehouse,
}: UpdateWarehouseDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton aria-label={`Edit ${warehouse.name}`} onClick={() => setOpen(true)} size="s" title={`Edit ${warehouse.name}`}>
        <Pencil aria-hidden="true" />
      </IconButton>
      <UpdateWarehouseDialog onOpenChange={setOpen} onUpdated={onUpdated} open={open} warehouse={warehouse} />
    </>
  );
};
