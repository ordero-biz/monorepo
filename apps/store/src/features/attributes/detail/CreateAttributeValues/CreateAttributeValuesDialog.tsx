'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { CreateAttributeValuesDialogFormContent } from './CreateAttributeValuesDialogFormContent';
import { useCreateAttributeValuesForm } from './hooks/useCreateAttributeValuesForm';
import type { CreateAttributeValuesDialogProps } from './types';

export const CreateAttributeValuesDialog = ({
  attributeId,
  attributeStatus,
  onOpenChange,
  open,
}: CreateAttributeValuesDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useCreateAttributeValuesForm({
    attributeId,
    attributeStatus,
    onAdded: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.values(attributeId),
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
          <Dialog.Popup size="sm">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <Dialog.Header>
                <Dialog.Title>Add attribute values</Dialog.Title>
              </Dialog.Header>

              <CreateAttributeValuesDialogFormContent
                attributeStatus={attributeStatus}
                form={form}
                open={open}
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
