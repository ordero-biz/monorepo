'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { useDeleteUnitsOfMeasurement } from './hooks/useDeleteUnitsOfMeasurement';
import type { DeleteUnitsOfMeasurementDialogProps } from './types';

export const DeleteUnitsOfMeasurementDialog = ({
  onDeleted,
  onOpenChange,
  open,
  unitsOfMeasurement,
}: DeleteUnitsOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();
  const isSingleUnit = unitsOfMeasurement.length === 1;

  const { handleDelete, isDeleting } = useDeleteUnitsOfMeasurement({
    onDeleted: async () => {
      onOpenChange(false);
      unitsOfMeasurement.forEach((unit) => {
        queryClient.removeQueries({
          queryKey: unitsOfMeasurementQueryKeys.detail(unit.id),
        });
      });
      await queryClient.invalidateQueries({
        queryKey: unitsOfMeasurementQueryKeys.list,
      });
      await onDeleted?.();
    },
    unitOfMeasurementIds: unitsOfMeasurement.map((unit) => unit.id),
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>
                {isSingleUnit
                  ? 'Delete unit of measurement'
                  : 'Delete units of measurement'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                {isSingleUnit ? (
                  <>
                    Are you sure you want to delete the "
                    <strong>{unitsOfMeasurement[0]?.name}</strong>" unit of
                    measurement?
                  </>
                ) : (
                  <>
                    Are you sure you want to delete {unitsOfMeasurement.length}{' '}
                    units of measurement?
                  </>
                )}
              </Typography>
            </Dialog.Content>

            <Dialog.Footer closeDisabled={isDeleting}>
              <Button
                color="error"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
