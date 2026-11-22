'use client';

import { useTransferQuery } from '@/lib/hooks/transfers/useTransferQuery';
import { Button, Card, Typography } from '@/ui/index';
import { UpdateTransfer } from '../UpdateTransfer';
import type { TransferDetailProps } from './types';

export const TransferDetail = ({ transferId }: TransferDetailProps) => {
  const transferQuery = useTransferQuery(transferId);

  if (transferQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading transfer...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (transferQuery.isError && !transferQuery.data) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this transfer right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => transferQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <UpdateTransfer key={transferQuery.data.id} transfer={transferQuery.data} />
  );
};
