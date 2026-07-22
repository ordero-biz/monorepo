'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { CategoryFormDialogContent } from '../../shared/CategoryFormDialogContent';
import { useUpdateCategoryForm } from './hooks/useUpdateCategoryForm';
import type { UpdateCategoryDialogProps } from './types';
import { getCategoryDefaultValues } from './utils/fields';

export const UpdateCategoryDialog = ({
  category,
  onOpenChange,
  onUpdated,
  open,
}: UpdateCategoryDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateCategoryForm({
    category,
    onUpdated: async (updatedCategory) => {
      form.reset(getCategoryDefaultValues(updatedCategory));
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.list,
      });
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.detail(category.id),
      });
      await onUpdated();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(getCategoryDefaultValues(category));
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
                <Dialog.Title>Edit category</Dialog.Title>
              </Dialog.Header>

              <CategoryFormDialogContent
                disabledCategoryIds={[category.id]}
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
