'use client';

import { IconButton } from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteAttributeDialog } from './DeleteAttributeDialog';
import type { DeleteAttributeDialogTriggerProps } from './types';

export const DeleteAttributeDialogTrigger = ({
  attribute,
}: DeleteAttributeDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`Delete ${attribute.name}`}
        onClick={() => setOpen(true)}
        size="xs"
        title={`Delete ${attribute.name}`}
      >
        <Trash2 aria-hidden="true" />
      </IconButton>

      <DeleteAttributeDialog
        attribute={attribute}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
};
