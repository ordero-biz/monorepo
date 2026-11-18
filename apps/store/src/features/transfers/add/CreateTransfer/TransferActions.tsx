'use client';

import { Button, ContextualActionBar, Typography } from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { StartTransferDialog } from './StartTransferDialog';
import type { TransferActionsProps } from './types';

export const TransferActions = ({
  count,
  units,
  deleteDisabled,
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  pendingIntent,
  onSaveDraft,
  onReviewTransfer,
  onTransfer,
}: TransferActionsProps) => {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const isSubmitting = pendingIntent !== null;

  return (
    <>
      <div aria-hidden="true" className="h-[var(--space-12)]" />
      <BaseLayoutContextualActionBar>
        {selectedCount > 0 ? (
          <ContextualActionBar.Root ariaLabel="Transfer entry bulk actions">
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
          <ContextualActionBar.Root ariaLabel="Transfer creation actions">
            <ContextualActionBar.Left>
              <Typography variant="body2">
                {count} {count === 1 ? 'product' : 'products'} ·{' '}
                {units.toLocaleString('en-US')} {units === 1 ? 'unit' : 'units'}
              </Typography>
            </ContextualActionBar.Left>
            <ContextualActionBar.Right>
              <div className="flex items-center gap-[var(--space-1)]">
                <Button
                  color="inherit"
                  disabled={isSubmitting}
                  onClick={onSaveDraft}
                  size="m"
                  type="button"
                  variant="outlined"
                >
                  {pendingIntent === 'draft' ? 'Saving...' : 'Save draft'}
                </Button>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (await onReviewTransfer()) {
                      setTransferDialogOpen(true);
                    }
                  }}
                  size="m"
                  type="button"
                >
                  {pendingIntent === 'transfer'
                    ? 'Transferring...'
                    : 'Transfer'}
                </Button>
              </div>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        )}
      </BaseLayoutContextualActionBar>
      <StartTransferDialog
        disabled={isSubmitting}
        onConfirm={onTransfer}
        onOpenChange={setTransferDialogOpen}
        open={transferDialogOpen}
      />
    </>
  );
};
