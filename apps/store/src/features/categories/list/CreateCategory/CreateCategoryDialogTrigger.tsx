'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { CreateCategoryDialog } from './CreateCategoryDialog';
import type { CreateCategoryDialogTriggerProps } from './types';

export const CreateCategoryDialogTrigger = ({
  availableCategories,
}: CreateCategoryDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Create Category
      </Button>

      <CreateCategoryDialog
        availableCategories={availableCategories}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
};
