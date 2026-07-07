'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import type { Supplier } from '@/lib/domain/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { getSupplierDefaultValues } from '../CreateSupplierDialog/constants';
import { SupplierEntityForm } from '../SupplierEntityForm/SupplierEntityForm';
import { useUpdateSupplierForm } from './hooks/useUpdateSupplierForm';

type UpdateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
  supplier: Supplier;
};

export const UpdateSupplierDialog = ({
  onOpenChange,
  onUpdated,
  open,
  supplier,
}: UpdateSupplierDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateSupplierForm({
    supplier,
    onUpdated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: suppliersQueryKeys.list,
      });
      await queryClient.invalidateQueries({
        queryKey: suppliersQueryKeys.detail(supplier.id),
      });
      await onUpdated();
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

              <SupplierEntityForm
                form={form}
                pendingText="Saving..."
                submitText="Save"
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
