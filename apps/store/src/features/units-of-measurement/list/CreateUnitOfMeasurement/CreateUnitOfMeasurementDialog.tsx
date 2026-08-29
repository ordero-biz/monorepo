'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { CreateUnitOfMeasurementDialogFormContent } from './CreateUnitOfMeasurementDialogFormContent';
import { useCreateUnitOfMeasurementForm } from './hooks/useCreateUnitOfMeasurementForm';
import type { CreateUnitOfMeasurementDialogProps } from './types';

export const CreateUnitOfMeasurementDialog = ({
  onOpenChange,
  open,
}: CreateUnitOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();

  const { form } = useCreateUnitOfMeasurementForm({
    onCreated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: unitsOfMeasurementQueryKeys.list,
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  };

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
                <Dialog.Title>Add unit of measurement</Dialog.Title>
              </Dialog.Header>

              <CreateUnitOfMeasurementDialogFormContent form={form} />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
