import { Button, Dialog, Typography } from '@ordero/ui';
import type { SourceWarehouseChangeDialogProps } from './types';

export const SourceWarehouseChangeDialog = ({
  pendingChange,
  onCancel,
  onConfirm,
}: SourceWarehouseChangeDialogProps) => (
  <Dialog.Root
    onOpenChange={(open) => {
      if (!open) onCancel();
    }}
    open={pendingChange !== null}
  >
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Viewport>
        <Dialog.Popup size="xs">
          {pendingChange ? (
            <SourceWarehouseChangeContent
              onConfirm={onConfirm}
              pendingChange={pendingChange}
            />
          ) : null}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
);

const SourceWarehouseChangeContent = ({
  pendingChange: { warehouse },
  onConfirm,
}: Pick<SourceWarehouseChangeDialogProps, 'onConfirm'> & {
  pendingChange: NonNullable<SourceWarehouseChangeDialogProps['pendingChange']>;
}) => (
  <>
    <Dialog.Header>
      <Dialog.Title>
        {warehouse ? 'Change source warehouse?' : 'Clear source warehouse?'}
      </Dialog.Title>
    </Dialog.Header>
    <Dialog.Content>
      <Typography variant="body1">
        {warehouse
          ? `Switching to ${warehouse.name} will remove the products from this transfer.`
          : 'Clearing the source warehouse will remove the products from this transfer.'}
      </Typography>
    </Dialog.Content>
    <Dialog.Footer closeButtonLabel="Cancel">
      <Button color="inherit" onClick={onConfirm} type="button">
        {warehouse ? 'Change and remove products' : 'Clear and remove products'}
      </Button>
    </Dialog.Footer>
  </>
);
