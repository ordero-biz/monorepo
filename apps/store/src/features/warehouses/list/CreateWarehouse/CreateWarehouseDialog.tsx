'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { WarehouseFormDialogContent } from '../../shared/WarehouseFormDialogContent';
import { useCreateWarehouseForm } from './hooks/useCreateWarehouseForm';
import type { CreateWarehouseDialogProps } from './types';

export const CreateWarehouseDialog = ({
  onOpenChange,
  open,
}: CreateWarehouseDialogProps) => {
  const queryClient = useQueryClient();

  const { form } = useCreateWarehouseForm({
    onCreated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: warehousesQueryKeys.list,
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
                <Dialog.Title>Add warehouse</Dialog.Title>
              </Dialog.Header>

              <WarehouseFormDialogContent
                form={form}
                pendingText="Adding..."
                submitText="Add"
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
