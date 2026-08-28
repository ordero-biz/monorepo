'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { useUpdateWarehouseForm } from './hooks/useUpdateWarehouseForm';
import type { UpdateWarehouseDialogProps } from './types';
import { UpdateWarehouseFormDialogContent } from './UpdateWarehouseFormDialogContent';
import { getWarehouseDefaultValues } from './utils/fields';

export const UpdateWarehouseDialog = ({
  warehouse,
  onOpenChange,
  onUpdated,
  open,
}: UpdateWarehouseDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateWarehouseForm({
    warehouse,
    onUpdated: async (updatedWarehouse) => {
      form.reset(getWarehouseDefaultValues(updatedWarehouse));
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: warehousesQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: warehousesQueryKeys.detail(warehouse.id),
        }),
      ]);
      await onUpdated();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(getWarehouseDefaultValues(warehouse));
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
                <Dialog.Title>Edit warehouse</Dialog.Title>
              </Dialog.Header>

              <UpdateWarehouseFormDialogContent form={form} />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
