'use client';

import { IconButton } from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Attribute } from '@/lib/domain/attributes';
import { DeleteAttributeDialog } from './DeleteAttributeDialog';

type DeleteAttributeDialogTriggerProps = {
  attribute: Attribute;
};

export const DeleteAttributeDialogTrigger = ({
  attribute,
}: DeleteAttributeDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`Delete ${attribute.name}`}
        onClick={() => setOpen(true)}
        size="s"
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
