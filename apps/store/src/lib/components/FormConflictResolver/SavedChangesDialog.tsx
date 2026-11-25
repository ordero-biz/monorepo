'use client';

import { Button, Dialog } from '@ordero/ui';
import { useId } from 'react';
import type { SavedChangesDialogProps } from './types';

export const SavedChangesDialog = ({
  open,
  title,
  description,
  reviewAction,
  onClose,
}: SavedChangesDialogProps) => {
  const descriptionId = useId();
  return (
    <Dialog.Root
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      open={open}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup aria-describedby={descriptionId} size="sm">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content id={descriptionId}>{description}</Dialog.Content>
            <Dialog.Footer
              closeButtonLabel={reviewAction ? 'Keep editing' : 'Close'}
            >
              {reviewAction && (
                <Button onClick={reviewAction.onClick} type="button">
                  {reviewAction.label}
                </Button>
              )}
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
