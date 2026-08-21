'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { ActivateAttributeDialog } from './ActivateAttributeDialog';
import type { ActivateAttributeDialogTriggerProps } from './types';

export const ActivateAttributeDialogTrigger = ({
  attribute,
  onUpdated,
}: ActivateAttributeDialogTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} type="button">
        Publish
      </Button>

      <ActivateAttributeDialog
        attribute={attribute}
        onOpenChange={setOpen}
        onUpdated={onUpdated}
        open={open}
      />
    </>
  );
};
