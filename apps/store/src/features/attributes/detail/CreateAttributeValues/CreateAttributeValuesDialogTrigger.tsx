'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateAttributeValuesDialog } from './CreateAttributeValuesDialog';
import type { CreateAttributeValuesDialogTriggerProps } from './types';

export const CreateAttributeValuesDialogTrigger = ({
  attributeId,
  attributeStatus,
}: CreateAttributeValuesDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        color="inherit"
        variant="soft"
        onClick={() => setOpen(true)}
        type="button"
      >
        Add Value
      </Button>

      <CreateAttributeValuesDialog
        attributeId={attributeId}
        attributeStatus={attributeStatus}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
};
