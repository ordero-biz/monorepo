'use client';

import { Card, DataTable, PageHeader, Typography } from '@ordero/ui';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import type { SupplyEntry } from '@/lib/domain/supplies/types';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';
import { formatMoney } from '../../shared/formatMoney';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';
import { columns } from './columns';
import type { SupplyReadOnlyProps } from './types';

const getRowId = (entry: SupplyEntry) => String(entry.id);

export const SupplyReadOnly = ({ supply }: SupplyReadOnlyProps) => {
  const information = [
    { label: 'Supplier', value: supply.supplier.name },
    { label: 'Warehouse', value: supply.warehouse.name },
    { label: 'Supply number', value: supply.supplyNumber },
    { label: 'Supplier invoice number', value: supply.supplierInvoiceNumber },
    { label: 'Comment', value: supply.comment },
  ];

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
            <div className="flex min-w-0 items-center gap-[var(--space-1)]">
              <Typography variant="h5">
                {supply.supplyNumber || 'Supply'}
              </Typography>
              <SupplyStatusChip status={supply.status} />
            </div>
            <AppBreadcrumbs
              items={[
                suppliesRootBreadcrumb,
                {
                  id: 'current-supply',
                  label: supply.supplyNumber || 'Supply',
                },
              ]}
            />
          </div>
        </PageHeader.Left>
      </PageHeader.Root>

      <div className="flex flex-col gap-[var(--space-3)]">
        <Card.Root variant="filled">
          <Card.Header>
            <Card.Title>Supply information</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-[var(--space-3)]">
              <dl className="grid gap-[var(--space-3)] md:grid-cols-2">
                {information.map(({ label, value }) => (
                  <div
                    className="flex min-w-0 flex-col gap-[var(--space-1)]"
                    key={label}
                  >
                    <dt>
                      <Typography color="text-secondary" variant="body2">
                        {label}
                      </Typography>
                    </dt>
                    <dd className="min-w-0 whitespace-pre-wrap break-words">
                      <Typography variant="body1">{value || '-'}</Typography>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card.Content>
        </Card.Root>

        <div className="flex flex-col gap-[var(--space-2)]">
          <Typography variant="h6">Supply entries</Typography>
          <DataTable
            ariaLabel="Supply entries"
            columns={columns}
            data={supply.supplyEntries}
            emptyMessage="No products in this supply."
            footerColumns={{
              product: <Typography variant="subtitle1">Total</Typography>,
              total: (
                <Typography variant="subtitle1">
                  {formatMoney(supply.totalPrice)}
                </Typography>
              ),
            }}
            getRowId={getRowId}
          />
        </div>
      </div>
    </div>
  );
};
