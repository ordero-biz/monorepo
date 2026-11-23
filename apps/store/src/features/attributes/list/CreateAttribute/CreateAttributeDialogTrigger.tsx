'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateAttributeDialog } from './CreateAttributeDialog';

export const CreateAttributeDialogTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Add attribute
      </Button>

      <CreateAttributeDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
