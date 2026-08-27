'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { useUpdateSupplierForm } from './hooks/useUpdateSupplierForm';
import type { UpdateSupplierDialogProps } from './types';
import { UpdateSupplierDialogFormContent } from './UpdateSupplierDialogFormContent';
import { getSupplierDefaultValues } from './utils/fields';

export const UpdateSupplierDialog = ({
  onOpenChange,
  onUpdated,
  open,
  supplier,
}: UpdateSupplierDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateSupplierForm({
    supplier,
    onUpdated: async (updatedSupplier) => {
      form.reset(getSupplierDefaultValues(updatedSupplier));
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: suppliersQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: suppliersQueryKeys.detail(supplier.id),
        }),
      ]);
      await onUpdated(updatedSupplier);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(getSupplierDefaultValues(supplier));
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
                <Dialog.Title>Edit supplier</Dialog.Title>
              </Dialog.Header>

              <UpdateSupplierDialogFormContent
                form={form}
                isSupplierActive={supplier.status === SUPPLIER_STATUS.ACTIVE}
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
