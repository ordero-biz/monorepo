'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateCategoryDialog } from './CreateCategoryDialog';

export const CreateCategoryDialogTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Add category
      </Button>

      <CreateCategoryDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
