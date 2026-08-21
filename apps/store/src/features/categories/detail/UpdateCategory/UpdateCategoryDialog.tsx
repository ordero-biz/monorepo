'use client';

import { Dialog } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { useUpdateCategoryForm } from './hooks/useUpdateCategoryForm';
import type { UpdateCategoryDialogProps } from './types';
import { UpdateCategoryDialogFormContent } from './UpdateCategoryDialogFormContent';
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
    onNoChanges: () => handleOpenChange(false),
    onUpdated: async (updatedCategory) => {
      form.reset(getCategoryDefaultValues(updatedCategory));
      onOpenChange(false);
      const parentCategoryIds = new Set(
        [
          category.parentCategory?.id,
          updatedCategory.parentCategory?.id,
        ].filter((categoryId): categoryId is number => categoryId !== undefined)
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.detail(category.id),
        }),
        ...[...parentCategoryIds].map((parentCategoryId) =>
          queryClient.invalidateQueries({
            queryKey: categoriesQueryKeys.children(parentCategoryId),
          })
        ),
      ]);
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

              <UpdateCategoryDialogFormContent
                disabledCategoryIds={[category.id]}
                form={form}
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
