'use client';

import { useCallback } from 'react';
import { getWarehouseStock } from '@/lib/client/api/warehouses';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import type { TransferStockItemSelection } from '../types';
import { getStockItemKey, getUnitOfMeasurementLabel } from '../utils/entries';
import type { SourceStockAsyncComboboxProps } from './types';

const getStockItemLabel = ({ productVariant }: TransferStockItemSelection) =>
  productVariant.sku
    ? `${productVariant.name} · ${productVariant.sku}`
    : productVariant.name;

const renderStockItemOption = (stockItem: TransferStockItemSelection) => (
  <span className="flex min-w-0 flex-1 items-center justify-between gap-[var(--space-2)]">
    <span className="truncate">{getStockItemLabel(stockItem)}</span>
    {/* Keeps the SKU and stock count apart in the option's accessible name. */}
    <span className="sr-only">, </span>
    <span className="shrink-0 text-muted-foreground">
      {stockItem.available}{' '}
      {getUnitOfMeasurementLabel(stockItem.unitOfMeasurement)} in stock
    </span>
  </span>
);

export const SourceStockAsyncCombobox = ({
  warehouseId,
  ...props
}: SourceStockAsyncComboboxProps) => {
  const loadStockOptions = useCallback(
    async ({
      page,
      pageSize,
    }: AsyncComboboxLoadOptionsArgs): Promise<
      AsyncComboboxLoadOptionsResult<TransferStockItemSelection>
    > => {
      if (warehouseId === null) {
        return { options: [] };
      }

      const result = await getWarehouseStock(warehouseId, {
        page,
        size: pageSize,
      });

      if (!result.ok) {
        throw result.error;
      }

      return {
        nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
        options: result.data.content
          .filter((stockItem) => stockItem.quantity > 0)
          .map(({ productVariant, unitOfMeasurement, quantity }) => ({
            productVariant: {
              id: productVariant.id,
              name: productVariant.name,
              sku: productVariant.sku,
            },
            unitOfMeasurement: {
              id: unitOfMeasurement.id,
              name: unitOfMeasurement.name,
              symbol: unitOfMeasurement.symbol,
            },
            available: quantity,
          })),
      };
    },
    [warehouseId]
  );

  return (
    <AsyncCombobox<TransferStockItemSelection>
      {...props}
      disabled={props.disabled || warehouseId === null}
      emptyText="No products in stock"
      getOptionLabel={getStockItemLabel}
      getOptionValue={getStockItemKey}
      loadErrorText="We couldn't load warehouse stock right now."
      loadOptions={loadStockOptions}
      loadingText="Loading stock..."
      pageSize={100}
      queryKey={[
        ...warehousesQueryKeys.stock(warehouseId ?? 'none'),
        'combobox',
      ]}
      renderOption={renderStockItemOption}
    />
  );
};
