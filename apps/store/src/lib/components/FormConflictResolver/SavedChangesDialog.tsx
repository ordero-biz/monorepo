'use client';

import { Button, Dialog } from '@ordero/ui';
import type { SavedChangesDialogProps } from './types';

export const SavedChangesDialog = ({
  open,
  title,
  description,
  reviewAction,
  onClose,
}: SavedChangesDialogProps) => (
  <Dialog.Root onOpenChange={(nextOpen) => !nextOpen && onClose()} open={open}>
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Viewport>
        <Dialog.Popup size="sm">
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Content>{description}</Dialog.Content>
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
