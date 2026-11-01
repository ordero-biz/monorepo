'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { useDeleteCategories } from './hooks/useDeleteCategories';
import type { DeleteCategoriesDialogProps } from './types';

export const DeleteCategoriesDialog = ({
  categories,
  onDeleted,
  onOpenChange,
  open,
}: DeleteCategoriesDialogProps) => {
  const queryClient = useQueryClient();
  const isSingleCategory = categories.length === 1;

  const { handleDelete, isDeleting } = useDeleteCategories({
    categoryIds: categories.map((category) => category.id),
    onDeleted: async () => {
      onOpenChange(false);
      const parentCategoryIds = new Set<number>();

      categories.forEach((category) => {
        queryClient.removeQueries({
          queryKey: categoriesQueryKeys.detail(category.id),
        });

        if (category.parentCategory) {
          parentCategoryIds.add(category.parentCategory.id);
        }
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.list,
        }),
        ...Array.from(parentCategoryIds).map((parentCategoryId) =>
          queryClient.invalidateQueries({
            queryKey: categoriesQueryKeys.children(parentCategoryId),
          })
        ),
        onDeleted?.(),
      ]);
    },
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>
                {isSingleCategory ? 'Delete category' : 'Delete categories'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                {isSingleCategory ? (
                  <>
                    Are you sure you want to delete the "
                    <strong>{categories[0]?.name}</strong>" category?
                  </>
                ) : (
                  <>
                    Are you sure you want to delete {categories.length}{' '}
                    categories?
                  </>
                )}
              </Typography>
            </Dialog.Content>

            <Dialog.Footer closeDisabled={isDeleting}>
              <Button
                color="error"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
