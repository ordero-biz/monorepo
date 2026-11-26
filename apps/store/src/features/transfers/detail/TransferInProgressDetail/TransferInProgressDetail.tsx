'use client';

import { Card, DataTable, Typography } from '@ordero/ui';
import { Warehouse } from 'lucide-react';
import type { TransferEntry } from '@/lib/domain/transfers/types';
import { formatDate } from '@/lib/utils/formatDate';
import { columns } from './columns';
import type { TransferInProgressDetailProps } from './types';

const getRowId = (entry: TransferEntry) => String(entry.id);

export const TransferInProgressDetail = ({
  transfer,
}: TransferInProgressDetailProps) => {
  const sent = transfer.dispatchedAt
    ? [formatDate(transfer.dispatchedAt), transfer.dispatchedBy]
        .filter(Boolean)
        .join(' · ')
    : null;
  // Two columns on wide screens: warehouses on the left, sent and comment on the right.
  const information = [
    {
      label: 'From warehouse',
      value: transfer.sourceWarehouse.name,
      isWarehouse: true,
    },
    {
      label: 'To warehouse',
      value: transfer.destinationWarehouse.name,
      isWarehouse: true,
    },
    { label: 'Sent', value: sent },
    { label: 'Comment', value: transfer.comment },
  ];
  const totalQuantity = transfer.transferEntries.reduce(
    (total, entry) => total + entry.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <Card.Root variant="filled">
        <Card.Header>
          <Card.Title>Transfer information</Card.Title>
        </Card.Header>
        <Card.Content>
          <dl className="grid gap-[var(--space-3)] md:grid-flow-col md:grid-cols-2 md:grid-rows-2">
            {information.map(({ label, value, isWarehouse }) => (
              <div
                className="flex min-w-0 flex-col gap-[var(--space-1)]"
                key={label}
              >
                <dt>
                  <Typography color="text-secondary" variant="body2">
                    {label}
                  </Typography>
                </dt>
                <dd className="flex min-w-0 items-center gap-[var(--space-1)] whitespace-pre-wrap break-words">
                  {isWarehouse ? (
                    <Warehouse
                      aria-hidden="true"
                      className="size-[var(--space-3)] shrink-0 text-[var(--text-secondary)]"
                    />
                  ) : null}
                  <Typography variant="body1">{value || '-'}</Typography>
                </dd>
              </div>
            ))}
          </dl>
        </Card.Content>
      </Card.Root>

      <div className="flex flex-col gap-[var(--space-2)]">
        <Typography variant="h6">Transfer entries</Typography>
        <DataTable
          ariaLabel="Transfer entries"
          columns={columns}
          data={transfer.transferEntries}
          emptyMessage="No products in this transfer."
          footerColumns={{
            product: <Typography variant="subtitle1">Total</Typography>,
            quantity: (
              <Typography variant="subtitle1">
                {totalQuantity.toLocaleString('en-US')}
              </Typography>
            ),
          }}
          getRowId={getRowId}
        />
      </div>
    </div>
  );
};
