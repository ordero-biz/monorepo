import type { WarehousesAsyncComboboxProps } from '@/features/warehouses/shared/WarehousesAsyncCombobox';
import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type {
  TransferStockItemSelection,
  TransferWarehouseSelection,
} from '../types';

export type SourceStockAsyncComboboxProps = Pick<
  AsyncComboboxSingleProps<TransferStockItemSelection>,
  | 'aria-label'
  | 'disabled'
  | 'errorText'
  | 'invalid'
  | 'isOptionDisabled'
  | 'name'
  | 'onBlur'
  | 'onValueChange'
  | 'placeholder'
  | 'required'
  | 'size'
  | 'value'
> & {
  warehouseId: number | null;
};

export type TransferWarehouseComboboxProps = Pick<
  WarehousesAsyncComboboxProps,
  | 'disabled'
  | 'errorText'
  | 'invalid'
  | 'isOptionDisabled'
  | 'label'
  | 'name'
  | 'onBlur'
  | 'placeholder'
  | 'ref'
  | 'required'
  | 'size'
  | 'value'
> & {
  onValueChange: (warehouse: TransferWarehouseSelection | null) => void;
};
