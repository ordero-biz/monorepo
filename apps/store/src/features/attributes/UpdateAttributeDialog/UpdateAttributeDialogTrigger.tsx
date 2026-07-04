'use client';

import { IconButton } from '@ordero/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { Attribute } from '@/lib/domain/attributes';
import { UpdateAttributeDialog } from './UpdateAttributeDialog';

type UpdateAttributeDialogTriggerProps = {
  attribute: Attribute;
  onUpdated: () => Promise<void> | void;
};

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
        size="s"
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
