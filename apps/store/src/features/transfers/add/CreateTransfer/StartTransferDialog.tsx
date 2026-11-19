import { Button, Dialog, Typography } from '@ordero/ui';
import type { StartTransferDialogProps } from './types';

export const StartTransferDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: StartTransferDialogProps) => (
  <Dialog.Root onOpenChange={onOpenChange} open={open}>
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Viewport>
        <Dialog.Popup size="xs">
          <Dialog.Header>
            <Dialog.Title>Start transfer</Dialog.Title>
          </Dialog.Header>
          <Dialog.Content>
            <div className="flex flex-col gap-[var(--space-2)]">
              <Typography variant="body1">
                Are you sure you want to send these products?
              </Typography>
              <Typography variant="body1">
                <strong>
                  The transfer will be marked as In Transit. Its products will
                  be unavailable for stock operations until the transfer is
                  completed.
                </strong>
              </Typography>
            </div>
          </Dialog.Content>
          <Dialog.Footer closeButtonLabel="Cancel">
            <Button
              color="primary"
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
              type="button"
            >
              Start transfer
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
);
