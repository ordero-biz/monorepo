'use client';

import { useCallback, useMemo } from 'react';
import { getWarehouseStock } from '@/lib/client/api/warehouses';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import type { WarehouseProductSelection } from '@/lib/domain/warehouses/types';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import type { WarehouseProductsAsyncComboboxProps } from './types';

const getWarehouseProductKey = (stockItem: WarehouseProductSelection) =>
  `${stockItem.productVariant.id}:${stockItem.unitOfMeasurement.id}`;
const getWarehouseProductLabel = ({
  productVariant,
}: WarehouseProductSelection) =>
  productVariant.sku
    ? `${productVariant.name} · ${productVariant.sku}`
    : productVariant.name;

const getUnitOfMeasurementLabel = (
  unit: WarehouseProductSelection['unitOfMeasurement']
) => (unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name);

const renderWarehouseProductOption = (stockItem: WarehouseProductSelection) => (
  <span className="flex min-w-0 flex-1 items-center justify-between gap-[var(--space-2)]">
    <span className="truncate">{getWarehouseProductLabel(stockItem)}</span>
    {/* Keeps the SKU and stock count apart in the option's accessible name. */}
    <span className="sr-only">, </span>
    <span className="shrink-0 text-muted-foreground">
      {stockItem.available}{' '}
      {getUnitOfMeasurementLabel(stockItem.unitOfMeasurement)} in stock
    </span>
  </span>
);

export const WarehouseProductsAsyncCombobox = ({
  'aria-label': ariaLabel,
  disabled,
  disabledProductKeys,
  errorText,
  invalid,
  name,
  onBlur,
  onValueChange,
  placeholder,
  required,
  size,
  value,
  warehouseId,
}: WarehouseProductsAsyncComboboxProps) => {
  const disabledStockItemKeySet = useMemo(
    () => new Set(disabledProductKeys),
    [disabledProductKeys]
  );
  const isOptionDisabled = useCallback(
    (stockItem: WarehouseProductSelection) =>
      disabledStockItemKeySet.has(getWarehouseProductKey(stockItem)),
    [disabledStockItemKeySet]
  );

  const loadStockOptions = useCallback(
    async ({
      page,
      pageSize,
    }: AsyncComboboxLoadOptionsArgs): Promise<
      AsyncComboboxLoadOptionsResult<WarehouseProductSelection>
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
              barcode: productVariant.barcode,
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
    <AsyncCombobox<WarehouseProductSelection>
      aria-label={ariaLabel}
      disabled={disabled || warehouseId === null}
      emptyText="No products in stock"
      errorText={errorText}
      getOptionLabel={getWarehouseProductLabel}
      getOptionValue={getWarehouseProductKey}
      invalid={invalid}
      isOptionDisabled={isOptionDisabled}
      loadErrorText="We couldn't load warehouse stock right now."
      loadOptions={loadStockOptions}
      loadingText="Loading stock..."
      name={name}
      onBlur={onBlur}
      onValueChange={onValueChange}
      pageSize={100}
      placeholder={placeholder}
      queryKey={[
        ...warehousesQueryKeys.stock(warehouseId ?? 'none'),
        'combobox',
      ]}
      required={required}
      renderOption={renderWarehouseProductOption}
      size={size}
      value={value}
    />
  );
};
