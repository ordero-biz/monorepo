'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { UpdateCategoryDialogTriggerProps } from './types';
import { UpdateCategoryDialog } from './UpdateCategoryDialog';

export const UpdateCategoryDialogTrigger = ({
  availableCategories,
  category,
  onUpdated,
}: UpdateCategoryDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`Edit ${category.name}`}
        onClick={() => setOpen(true)}
        size="xs"
        title={`Edit ${category.name}`}
      >
        <Pencil aria-hidden="true" />
      </IconButton>
      <UpdateCategoryDialog
        availableCategories={availableCategories}
        category={category}
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
      />
    </>
  );
};
