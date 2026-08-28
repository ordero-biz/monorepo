'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useActivateUnitOfMeasurement } from './hooks/useActivateUnitOfMeasurement';
import type { UnitOfMeasurementDetailHeaderProps } from './types';

type ActivateUnitOfMeasurementDialogProps = Pick<
  UnitOfMeasurementDetailHeaderProps,
  'onUpdated' | 'unitOfMeasurement'
> & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const ActivateUnitOfMeasurementDialog = ({
  onOpenChange,
  onUpdated,
  open,
  unitOfMeasurement,
}: ActivateUnitOfMeasurementDialogProps) => {
  const { handleActivate, isActivating } = useActivateUnitOfMeasurement({
    onActivated: async () => {
      onOpenChange(false);
      await onUpdated();
    },
    unitOfMeasurementId: unitOfMeasurement.id,
    unitOfMeasurementName: unitOfMeasurement.name,
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Publish unit of measurement</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body1">
                  Are you sure you want to publish this unit of measurement?
                  Once active, it will be fully functional.
                </Typography>
                <Typography variant="body1">
                  <strong>
                    This action cannot be undone. However, you will still be
                    able to update the symbol and comment.
                  </strong>
                </Typography>
              </div>
            </Dialog.Content>
            <Dialog.Footer
              closeButtonLabel="Cancel"
              closeDisabled={isActivating}
            >
              <Button
                color="primary"
                disabled={isActivating}
                onClick={handleActivate}
                type="button"
              >
                {isActivating ? 'Publishing...' : 'Publish'}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
