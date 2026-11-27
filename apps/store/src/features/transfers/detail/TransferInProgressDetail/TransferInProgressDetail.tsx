'use client';

import { Card, Chip, DataTable, Typography } from '@ordero/ui';
import {
  ArrowUpRight,
  ChevronRight,
  Info,
  Truck,
  Warehouse,
} from 'lucide-react';
import Link from 'next/link';
import { getWarehouseDetailRoute } from '@/lib/client/routes';
import type { TransferEntry } from '@/lib/domain/transfers/types';
import { formatDateTime } from '@/lib/utils/formatDate';
import { columns } from './columns';
import './styles.css';
import type { TransferInProgressDetailProps } from './types';

const getRowId = (entry: TransferEntry) => String(entry.id);

const formatAuditEntry = (timestamp: string | null, actor: string | null) => {
  if (!timestamp) {
    return actor || null;
  }

  return [formatDateTime(timestamp), actor].filter(Boolean).join(' · ');
};

export const TransferInProgressDetail = ({
  transfer,
}: TransferInProgressDetailProps) => {
  const dispatched = formatAuditEntry(
    transfer.dispatchedAt,
    transfer.dispatchedBy
  );
  const created = formatAuditEntry(transfer.createdAt, transfer.createdBy);
  const skuCount = transfer.transferEntries.length;
  const skuCountLabel = `${skuCount.toLocaleString('en-US')} ${
    skuCount === 1 ? 'SKU' : 'SKUs'
  }`;
  const details = [
    { label: 'Comment', value: transfer.comment },
    { label: 'Dispatched', value: dispatched },
    { label: 'Created', value: created },
  ];

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <div
        className="flex items-start gap-[var(--space-1-5)] rounded-[var(--radius-1-5)] border border-[var(--color-info-16)] bg-[var(--color-info-8)] px-[var(--space-2)] py-[var(--space-1-5)]"
        role="note"
      >
        <Info
          aria-hidden="true"
          className="mt-[var(--space-2px)] size-[var(--icon-button-xs-icon)] shrink-0 text-[var(--info-main)]"
        />
        <Typography variant="body2">
          <strong>In transit.</strong> Stock has been deducted from{' '}
          <strong>{transfer.sourceWarehouse.name}</strong> and is locked until
          received at <strong>{transfer.destinationWarehouse.name}</strong>.
          Transfer details are read-only while in transit.
        </Typography>
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <Card.Root variant="filled">
          <Card.Header>
            <div className="flex flex-col gap-[var(--space-0-5)]">
              <Card.Title>Transfer route &amp; details</Card.Title>
              <Card.Description>
                Movement between warehouses and dispatch log
              </Card.Description>
            </div>
          </Card.Header>

          <Card.Content>
            <dl className="grid grid-cols-1 items-center gap-[var(--space-2)] md:grid-cols-[1fr_auto_1fr]">
              <div className="flex min-w-0 flex-col gap-[var(--space-1-5)] rounded-[var(--radius-1-5)] border border-[var(--border)] bg-[var(--background-neutral)] p-[var(--space-2)]">
                <div className="flex items-center justify-between gap-[var(--space-1)]">
                  <dt>
                    <Typography color="text-secondary" variant="overline">
                      From warehouse
                    </Typography>
                  </dt>
                  <Chip color="inherit" size="s" variant="soft">
                    Dispatched
                  </Chip>
                </div>
                <div className="flex min-w-0 items-center gap-[var(--space-1-5)]">
                  <div className="flex size-[var(--space-5)] shrink-0 items-center justify-center rounded-[var(--radius-1-25)] border border-[var(--border)] bg-card text-[var(--text-secondary)]">
                    <Warehouse
                      aria-hidden="true"
                      className="size-[var(--space-2-5)]"
                    />
                  </div>
                  <dd className="min-w-0">
                    <Link
                      className="group inline-flex max-w-full items-center gap-[var(--space-0-5)] text-[var(--text-primary)] hover:underline"
                      href={getWarehouseDetailRoute(
                        transfer.sourceWarehouse.id
                      )}
                    >
                      <Typography variant="subtitle2">
                        {transfer.sourceWarehouse.name}
                      </Typography>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-[var(--space-1-75)] shrink-0 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  </dd>
                </div>
              </div>

              <div className="flex items-center justify-center gap-[var(--space-1)] py-[var(--space-0-5)] md:flex-col md:px-[var(--space-1)]">
                <div className="transfer-route-chip">
                  <Chip
                    color="info"
                    size="s"
                    startIcon={
                      <Truck
                        aria-hidden="true"
                        className="size-[var(--space-1-75)]"
                      />
                    }
                    variant="soft"
                  >
                    {skuCountLabel}
                  </Chip>
                </div>
                <div
                  aria-hidden="true"
                  className="hidden items-center text-[var(--info-main)] md:flex"
                >
                  <span className="transfer-route-dots h-[var(--space-0-5)] w-[var(--space-14)]" />
                  <ChevronRight
                    className="-ml-[var(--space-1)] size-[var(--space-2)]"
                    strokeWidth={3}
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-[var(--space-1-5)] rounded-[var(--radius-1-5)] border border-[var(--border)] bg-[var(--background-neutral)] p-[var(--space-2)]">
                <div className="flex items-center justify-between gap-[var(--space-1)]">
                  <dt>
                    <Typography color="text-secondary" variant="overline">
                      To warehouse
                    </Typography>
                  </dt>
                  <Chip color="info" size="s" variant="soft">
                    Awaiting receipt
                  </Chip>
                </div>
                <div className="flex min-w-0 items-center gap-[var(--space-1-5)]">
                  <div className="flex size-[var(--space-5)] shrink-0 items-center justify-center rounded-[var(--radius-1-25)] border border-[var(--border)] bg-card text-[var(--text-secondary)]">
                    <Warehouse
                      aria-hidden="true"
                      className="size-[var(--space-2-5)]"
                    />
                  </div>
                  <dd className="min-w-0">
                    <Link
                      className="group inline-flex max-w-full items-center gap-[var(--space-0-5)] text-[var(--text-primary)] hover:underline"
                      href={getWarehouseDetailRoute(
                        transfer.destinationWarehouse.id
                      )}
                    >
                      <Typography variant="subtitle2">
                        {transfer.destinationWarehouse.name}
                      </Typography>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-[var(--space-1-75)] shrink-0 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  </dd>
                </div>
              </div>
            </dl>
          </Card.Content>

          <Card.Divider />

          <Card.Content>
            <dl className="grid gap-[var(--space-3)] md:grid-cols-3">
              {details.map(({ label, value }) => (
                <div
                  className="flex min-w-0 flex-col gap-[var(--space-0-5)]"
                  key={label}
                >
                  <dt>
                    <Typography color="text-secondary" variant="body2">
                      {label}
                    </Typography>
                  </dt>
                  <dd className="min-w-0 whitespace-pre-wrap break-words">
                    <Typography variant="body2">{value || '-'}</Typography>
                  </dd>
                </div>
              ))}
            </dl>
          </Card.Content>
        </Card.Root>

        <div className="flex flex-col gap-[var(--space-2)]">
          <div className="flex items-center gap-[var(--space-1)]">
            <Typography variant="h6">Transfer entries</Typography>
            <Chip color="inherit" size="s" variant="soft">
              {skuCount.toLocaleString('en-US')}
            </Chip>
          </div>
          <DataTable
            ariaLabel="Transfer entries"
            columns={columns}
            data={transfer.transferEntries}
            emptyMessage="No products in this transfer."
            getRowId={getRowId}
          />
        </div>
      </div>
    </div>
  );
};
