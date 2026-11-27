'use client';

import { Button, ContextualActionBar, Typography } from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { FormConflictResolver } from '@/lib/components/FormConflictResolver';
import { StartTransferDialog } from './StartTransferDialog';
import type { TransferActionsProps } from './types';

export const TransferActions = ({
  deleteDisabled,
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  pendingIntent,
  onSaveDraft,
  onTransfer,
}: TransferActionsProps) => {
  const resolver = FormConflictResolver.useContext();
  const submitDisabled = resolver?.isReadOnly ?? false;
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
            <ContextualActionBar.Left>{null}</ContextualActionBar.Left>
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
                  onClick={() => setTransferDialogOpen(true)}
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
        disabled={isSubmitting || submitDisabled}
        onConfirm={onTransfer}
        onOpenChange={setTransferDialogOpen}
        open={transferDialogOpen}
      />
    </>
  );
};
