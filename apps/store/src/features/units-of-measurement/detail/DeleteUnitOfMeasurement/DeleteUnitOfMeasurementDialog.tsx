'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { useDeleteUnitOfMeasurement } from './hooks/useDeleteUnitOfMeasurement';
import type { DeleteUnitOfMeasurementDialogProps } from './types';

export const DeleteUnitOfMeasurementDialog = ({
  onOpenChange,
  open,
  unitOfMeasurement,
}: DeleteUnitOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { handleDelete, isDeleting } = useDeleteUnitOfMeasurement({
    onDeleted: async () => {
      onOpenChange(false);
      queryClient.removeQueries({
        queryKey: unitsOfMeasurementQueryKeys.detail(unitOfMeasurement.id),
      });
      await queryClient.invalidateQueries({
        queryKey: unitsOfMeasurementQueryKeys.list,
      });
      router.push(clientRoutes.unitsOfMeasurement);
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
              <Dialog.Title>Delete unit of measurement</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                Are you sure you want to delete the "
                <strong>{unitOfMeasurement.name}</strong>" unit of measurement?
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
