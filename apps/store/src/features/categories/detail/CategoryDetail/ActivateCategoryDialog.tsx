'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useActivateCategory } from './hooks/useActivateCategory';
import type { ActivateCategoryDialogProps } from './types';

export const ActivateCategoryDialog = ({
  category,
  onOpenChange,
  onUpdated,
  open,
}: ActivateCategoryDialogProps) => {
  const { handleActivate, isActivating } = useActivateCategory({
    categoryId: category.id,
    categoryName: category.name,
    onActivated: async () => {
      onOpenChange(false);
      await onUpdated();
    },
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Publish category</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body1">
                  Are you sure you want to publish this category? Once active,
                  it will be fully functional, available for products, and
                  tracked in analytics.
                </Typography>
                <Typography variant="body1">
                  <strong>
                    This action cannot be undone, and the category will no
                    longer be editable.
                  </strong>
                </Typography>
              </div>
            </Dialog.Content>

            <Dialog.Footer
              closeButtonLabel="Cancel"
              closeDisabled={isActivating}
            >
              <Button
                color="primary"
                disabled={isActivating}
                onClick={handleActivate}
                type="button"
              >
                {isActivating ? 'Publishing...' : 'Publish'}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
