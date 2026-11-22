'use client';

import { Card, PageHeader, Typography, useToastManager } from '@ordero/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useEffectEvent } from 'react';
import { warehousesRootBreadcrumb } from '@/features/warehouses/shared/breadcrumbs';
import { getWarehouse } from '@/lib/client/api/warehouses';
import { getWarehouseDetailRoute } from '@/lib/client/routes';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { warehouseQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import type { TransferWarehouseSelection } from '../../shared/TransferEditorForm';
import { CreateTransferForm } from './CreateTransferForm';
import type { CreateTransferProps } from './types';

export const CreateTransfer = ({ sourceWarehouseId }: CreateTransferProps) => {
  const { add: addToast } = useToastManager();
  const sourceWarehouseQuery = useQuery({
    ...warehouseQueryOptions(sourceWarehouseId ?? 0, getWarehouse),
    enabled: sourceWarehouseId !== undefined,
    refetchOnWindowFocus: false,
  });

  const showSourceWarehouseNotice = useEffectEvent(() => {
    addToast({
      title: 'Choose a source warehouse',
      type: 'info',
    });
  });

  useEffect(() => {
    if (sourceWarehouseQuery.isLoadingError) {
      showSourceWarehouseNotice();
    }
  }, [sourceWarehouseQuery.isLoadingError]);

  if (sourceWarehouseId !== undefined && sourceWarehouseQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading warehouse...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  const sourceWarehouse: TransferWarehouseSelection | null =
    sourceWarehouseQuery.data
      ? {
          id: sourceWarehouseQuery.data.id,
          name: sourceWarehouseQuery.data.name,
          status: sourceWarehouseQuery.data.status,
        }
      : null;

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
            <Typography variant="h5">Create transfer</Typography>
            <AppBreadcrumbs
              items={[
                warehousesRootBreadcrumb,
                ...(sourceWarehouse
                  ? [
                      {
                        href: getWarehouseDetailRoute(sourceWarehouse.id),
                        id: 'source-warehouse',
                        label: sourceWarehouse.name,
                      },
                    ]
                  : []),
                { id: 'current-transfer', label: 'New transfer' },
              ]}
            />
          </div>
        </PageHeader.Left>
      </PageHeader.Root>

      <CreateTransferForm
        key={sourceWarehouseId}
        sourceWarehouse={sourceWarehouse}
      />
    </div>
  );
};
