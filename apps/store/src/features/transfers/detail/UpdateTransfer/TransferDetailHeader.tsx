'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { transfersRootBreadcrumb } from '../../shared/breadcrumbs';
import { TransferStatusChip } from '../../shared/TransferStatusChip';
import type { TransferDetailHeaderProps } from './types';

export const TransferDetailHeader = ({
  transfer,
}: TransferDetailHeaderProps) => {
  const transferTitle = transfer.transferNumber || 'Transfer';

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <div className="flex min-w-0 items-center gap-[var(--space-1)]">
            <Typography variant="h5">{transferTitle}</Typography>
            <TransferStatusChip status={transfer.status} />
          </div>
          <AppBreadcrumbs
            items={[
              transfersRootBreadcrumb,
              { id: 'current-transfer', label: transferTitle },
            ]}
          />
        </div>
      </PageHeader.Left>
    </PageHeader.Root>
  );
};
