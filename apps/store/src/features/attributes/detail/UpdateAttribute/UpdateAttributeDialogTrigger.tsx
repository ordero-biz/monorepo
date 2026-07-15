'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { UpdateAttributeDialogTriggerProps } from './types';
import { UpdateAttributeDialog } from './UpdateAttributeDialog';

export const UpdateAttributeDialogTrigger = ({
  attribute,
  onUpdated,
}: UpdateAttributeDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`Edit ${attribute.name}`}
        onClick={() => setOpen(true)}
        size="xs"
        title={`Edit ${attribute.name}`}
      >
        <Pencil aria-hidden="true" />
      </IconButton>

      <UpdateAttributeDialog
        attribute={attribute}
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
      />
    </>
  );
};
