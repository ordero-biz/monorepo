'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateCategoryDialog } from './ActivateCategoryDialog';
import type { ActivateCategoryDialogTriggerProps } from './types';

export const ActivateCategoryDialogTrigger = ({
  category,
  onUpdated,
}: ActivateCategoryDialogTriggerProps) => {
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

      <ActivateCategoryDialog
        category={category}
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
      />
    </>
  );
};
