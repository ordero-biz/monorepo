'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { SupplierFormDialogContent } from '../../shared/SupplierFormDialogContent';
import { useUpdateSupplierForm } from './hooks/useUpdateSupplierForm';
import type { UpdateSupplierDialogProps } from './types';
import { getSupplierDefaultValues } from './utils/fields';

export const UpdateSupplierDialog = ({
  onOpenChange,
  onUpdated,
  open,
  supplier,
}: UpdateSupplierDialogProps) => {
  const queryClient = useQueryClient();
  const latestSupplierRef = useRef(supplier);
  const [formSupplier, setFormSupplier] = useState(supplier);
  const { form } = useUpdateSupplierForm({
    supplier: formSupplier,
    onUpdated: async (updatedSupplier) => {
      latestSupplierRef.current = updatedSupplier;
      setFormSupplier(updatedSupplier);
      form.reset(getSupplierDefaultValues(updatedSupplier));
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: suppliersQueryKeys.list,
      });
      await queryClient.invalidateQueries({
        queryKey: suppliersQueryKeys.detail(supplier.id),
      });
      await onUpdated(updatedSupplier);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    form.reset(getSupplierDefaultValues(latestSupplierRef.current));
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

              <SupplierFormDialogContent
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
