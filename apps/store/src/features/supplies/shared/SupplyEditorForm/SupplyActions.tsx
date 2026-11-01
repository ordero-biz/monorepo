'use client';

import { Button, ContextualActionBar, Dialog, Typography } from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { FormConflictResolver } from '@/lib/components/FormConflictResolver';
import { formatMoney } from '@/lib/utils/formatMoney';
import type { SupplyActionsProps } from './types';

export const SupplyActions = ({
  count,
  deleteDisabled = false,
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  total,
  pendingIntent,
  onSaveDraft,
  onFinalize,
}: SupplyActionsProps) => {
  const resolver = FormConflictResolver.useContext();
  const submitDisabled = resolver?.isReadOnly ?? false;
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const isSubmitting = pendingIntent !== null;

  return (
    <>
      <div aria-hidden="true" className="h-[var(--space-12)]" />
      <BaseLayoutContextualActionBar>
        {selectedCount > 0 ? (
          <ContextualActionBar.Root ariaLabel="Supply entry bulk actions">
            <ContextualActionBar.Left>
              <Typography variant="body2">{selectedCount} selected</Typography>
              <Button
                color="inherit"
                onClick={onClearSelection}
                size="s"
                type="button"
                variant="text"
              >
                Clear selection
              </Button>
            </ContextualActionBar.Left>
            <ContextualActionBar.Right>
              <Button
                color="error"
                disabled={deleteDisabled}
                onClick={onDeleteSelected}
                size="m"
                startIcon={<Trash2 aria-hidden="true" />}
                type="button"
                variant="soft"
              >
                Delete
              </Button>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        ) : (
          <ContextualActionBar.Root ariaLabel="Supply creation actions">
            <ContextualActionBar.Left>
              <Typography variant="body2">
                {count} {count === 1 ? 'product' : 'products'} · Total{' '}
                {formatMoney(total)}
              </Typography>
            </ContextualActionBar.Left>
            <ContextualActionBar.Right>
              <div className="flex items-center gap-[var(--space-1)]">
                <FormConflictResolver.ReviewButton />
                <Button
                  color="inherit"
                  disabled={isSubmitting || submitDisabled}
                  onClick={onSaveDraft}
                  size="m"
                  type="button"
                  variant="outlined"
                >
                  {pendingIntent === 'draft' ? 'Saving...' : 'Save draft'}
                </Button>
                <Button
                  color="primary"
                  disabled={isSubmitting || submitDisabled}
                  onClick={() => setFinalizeDialogOpen(true)}
                  size="m"
                  type="button"
                >
                  {pendingIntent === 'finalize'
                    ? 'Finalizing...'
                    : 'Finalize supply'}
                </Button>
              </div>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        )}
      </BaseLayoutContextualActionBar>
      <Dialog.Root
        onOpenChange={setFinalizeDialogOpen}
        open={finalizeDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              <Dialog.Header>
                <Dialog.Title>Finalize supply</Dialog.Title>
              </Dialog.Header>
              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <Typography variant="body1">
                    Are you sure you want to finalize this supply?
                  </Typography>
                  <Typography variant="body1">
                    <strong>
                      This action cannot be undone. The supply will no longer be
                      editable.
                    </strong>
                  </Typography>
                </div>
              </Dialog.Content>
              <Dialog.Footer closeButtonLabel="Cancel">
                <Button
                  color="primary"
                  disabled={isSubmitting || submitDisabled}
                  onClick={() => {
                    setFinalizeDialogOpen(false);
                    onFinalize();
                  }}
                  type="button"
                >
                  Finalize supply
                </Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
