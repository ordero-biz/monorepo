'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { useUpdateUnitOfMeasurementForm } from './hooks/useUpdateUnitOfMeasurementForm';
import type { UpdateUnitOfMeasurementDialogProps } from './types';
import { UpdateUnitOfMeasurementDialogFormContent } from './UpdateUnitOfMeasurementDialogFormContent';
import { getUnitOfMeasurementDefaultValues } from './utils/fields';

export const UpdateUnitOfMeasurementDialog = ({
  onOpenChange,
  onUpdated,
  open,
  unitOfMeasurement,
}: UpdateUnitOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateUnitOfMeasurementForm({
    onNoChanges: () => handleOpenChange(false),
    onUpdated: async (updatedUnitOfMeasurement) => {
      form.reset(getUnitOfMeasurementDefaultValues(updatedUnitOfMeasurement));
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: unitsOfMeasurementQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: unitsOfMeasurementQueryKeys.detail(unitOfMeasurement.id),
        }),
      ]);
      await onUpdated(updatedUnitOfMeasurement);
    },
    unitOfMeasurement,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(getUnitOfMeasurementDefaultValues(unitOfMeasurement));
    }
  };

  const isUnitOfMeasurementActive =
    unitOfMeasurement.status === UNIT_OF_MEASUREMENT_STATUS.ACTIVE;

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <Dialog.Header>
                <Dialog.Title>Edit unit of measurement</Dialog.Title>
              </Dialog.Header>

              <UpdateUnitOfMeasurementDialogFormContent
                form={form}
                isUnitOfMeasurementActive={isUnitOfMeasurementActive}
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
