'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { CreateAttributeDialogFormContent } from './CreateAttributeDialogFormContent';
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm';
import type { CreateAttributeDialogProps } from './types';

export const CreateAttributeDialog = ({
  onOpenChange,
  open,
}: CreateAttributeDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { form } = useCreateAttributeForm({
    onCreated: async (attributeId) => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      router.push(getAttributeDetailRoute(attributeId));
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
                <Dialog.Title>Add new attribute</Dialog.Title>
              </Dialog.Header>

              <CreateAttributeDialogFormContent form={form} open={open} />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
