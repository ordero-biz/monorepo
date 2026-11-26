'use client';

import { Chip, CopyButton, Menu, PageHeader, Typography } from '@ordero/ui';
import { Clock, EllipsisVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { FormConflictResolver } from '@/lib/components/FormConflictResolver';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import { transfersRootBreadcrumb } from '../../shared/breadcrumbs';
import { TransferStatusChip } from '../../shared/TransferStatusChip';
import { DeleteTransferDialog } from '../DeleteTransfer';
import type { TransferDetailHeaderProps } from './types';
import { formatTransitDuration } from './utils/formatTransitDuration';

export const TransferDetailHeader = ({
  transfer,
  onDeleted,
}: TransferDetailHeaderProps) => {
  const resolver = FormConflictResolver.useContext();
  const deleteDisabled = resolver?.isReadOnly ?? false;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isDraft = transfer.status === TRANSFER_STATUS.DRAFT;
  const isInTransit = transfer.status === TRANSFER_STATUS.IN_TRANSIT;
  const hasTransferNumber = Boolean(transfer.transferNumber);
  const transferTitle = transfer.transferNumber || 'Transfer';
  const transitDuration = isInTransit
    ? formatTransitDuration(transfer.dispatchedAt)
    : null;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-1)]">
            <Typography variant="h5">{transferTitle}</Typography>
            {hasTransferNumber ? (
              <CopyButton
                copyLabel="Copy transfer number"
                size="s"
                value={transfer.transferNumber}
              />
            ) : null}
            <TransferStatusChip status={transfer.status} />
            {transitDuration ? (
              <Chip
                color="inherit"
                size="s"
                startIcon={
                  <Clock
                    aria-hidden="true"
                    className="size-[var(--space-1-75)]"
                  />
                }
                variant="soft"
              >
                {transitDuration}
              </Chip>
            ) : null}
          </div>
          <AppBreadcrumbs
            items={[
              transfersRootBreadcrumb,
              { id: 'current-transfer', label: transferTitle },
            ]}
          />
        </div>
      </PageHeader.Left>

      {isDraft ? (
        <PageHeader.Right>
          <Menu.Root>
            <Menu.Trigger
              aria-label={`Actions for ${transferTitle}`}
              appearance="iconButton"
              disabled={deleteDisabled}
              size="s"
              title={`Actions for ${transferTitle}`}
            >
              <EllipsisVertical aria-hidden="true" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner align="end">
                <Menu.Popup>
                  <Menu.Item
                    color="error"
                    disabled={deleteDisabled}
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2
                      aria-hidden="true"
                      className="size-[var(--icon-button-xs-icon)]"
                    />
                    Delete transfer
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>

          <DeleteTransferDialog
            disabled={deleteDisabled}
            onDeleted={onDeleted}
            onOpenChange={setIsDeleteDialogOpen}
            open={isDeleteDialogOpen}
            transfer={transfer}
          />
        </PageHeader.Right>
      ) : null}
    </PageHeader.Root>
  );
};
