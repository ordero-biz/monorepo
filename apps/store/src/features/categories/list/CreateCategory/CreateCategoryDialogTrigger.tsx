'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import type { Category } from '@/lib/domain/categories';
import { CreateCategoryDialog } from './CreateCategoryDialog';

type CreateCategoryDialogTriggerProps = {
  availableCategories: Category[];
};

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
