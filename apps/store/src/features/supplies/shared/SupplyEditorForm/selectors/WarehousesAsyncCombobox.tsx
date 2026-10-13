'use client';

import { Chip } from '@ordero/ui';
import { getWarehouses } from '@/lib/client/api/warehouses';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import type { WarehousesAsyncComboboxProps } from './types';

const loadWarehouseOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<AsyncComboboxLoadOptionsResult> => {
  const result = await getWarehouses({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map((warehouse) => ({
      data: warehouse,
      displayValue: warehouse.name,
      label: (
        <span className="flex min-w-0 items-center gap-[var(--space-1)]">
          <span className="truncate">{warehouse.name}</span>
          {warehouse.status === WAREHOUSE_STATUS.DRAFT ? (
            <Chip size="s" variant="soft">
              Draft
            </Chip>
          ) : null}
        </span>
      ),
      value: String(warehouse.id),
    })),
  };
};

export const WarehousesAsyncCombobox = (
  props: WarehousesAsyncComboboxProps
) => (
  <AsyncCombobox
    {...props}
    emptyText="No warehouses found"
    loadErrorText="We couldn't load warehouses right now."
    loadOptions={loadWarehouseOptions}
    loadingText="Loading warehouses..."
    pageSize={100}
    queryKey={warehousesQueryKeys.options()}
  />
);
