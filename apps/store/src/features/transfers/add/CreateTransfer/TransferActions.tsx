'use client';

import { Button, ContextualActionBar, Typography } from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import type { TransferActionsProps } from './types';

export const TransferActions = ({
  count,
  units,
  deleteDisabled,
  selectedCount,
  onClearSelection,
  onDeleteSelected,
}: TransferActionsProps) => (
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
            <div className="flex items-center gap-[var(--space-1)]">
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
            </div>
          </ContextualActionBar.Right>
        </ContextualActionBar.Root>
      ) : (
        <ContextualActionBar.Root ariaLabel="Transfer summary">
          <ContextualActionBar.Left>
            <Typography variant="body2">
              {count} {count === 1 ? 'product' : 'products'} ·{' '}
              {units.toLocaleString('en-US')} {units === 1 ? 'unit' : 'units'}
            </Typography>
          </ContextualActionBar.Left>
        </ContextualActionBar.Root>
      )}
    </BaseLayoutContextualActionBar>
  </>
);
