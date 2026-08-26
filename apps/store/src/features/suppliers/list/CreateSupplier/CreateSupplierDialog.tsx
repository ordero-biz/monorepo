'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { SupplierFormDialogContent } from '../../shared/SupplierFormDialogContent';
import { useCreateSupplierForm } from './hooks/useCreateSupplierForm';

import type { CreateSupplierDialogProps } from './types';

export const CreateSupplierDialog = ({
  onOpenChange,
  open,
}: CreateSupplierDialogProps) => {
  const queryClient = useQueryClient();

  const { form } = useCreateSupplierForm({
    onCreated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: suppliersQueryKeys.list,
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
                <Dialog.Title>Add supplier</Dialog.Title>
              </Dialog.Header>

              <SupplierFormDialogContent
                form={form}
                isCreate
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
