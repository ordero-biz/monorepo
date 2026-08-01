'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { CategoryFormDialogContent } from '../../shared/CategoryFormDialogContent';
import { createCategoryDefaultValues } from './constants';
import { useCreateCategoryForm } from './hooks/useCreateCategoryForm';
import type { CreateCategoryDialogProps } from './types';

export const CreateCategoryDialog = ({
  onOpenChange,
  open,
}: CreateCategoryDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useCreateCategoryForm({
    onCreated: async (createdCategory) => {
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.list,
        }),
        ...(createdCategory.parentCategory
          ? [
              queryClient.invalidateQueries({
                queryKey: categoriesQueryKeys.children(
                  createdCategory.parentCategory.id
                ),
              }),
            ]
          : []),
      ]);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(createCategoryDefaultValues);
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
                <Dialog.Title>Add new category</Dialog.Title>
              </Dialog.Header>

              <CategoryFormDialogContent
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
