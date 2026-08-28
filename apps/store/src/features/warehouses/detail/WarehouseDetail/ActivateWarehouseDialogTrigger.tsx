'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateWarehouseDialog } from './ActivateWarehouseDialog';
import type { ActivateWarehouseDialogTriggerProps } from './types';

export const ActivateWarehouseDialogTrigger = ({
  onUpdated,
  warehouse,
}: ActivateWarehouseDialogTriggerProps) => {
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
      <ActivateWarehouseDialog
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
        warehouse={warehouse}
      />
    </>
  );
};
