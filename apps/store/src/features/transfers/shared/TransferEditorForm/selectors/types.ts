import type { WarehousesAsyncComboboxProps } from '@/features/warehouses/shared/WarehousesAsyncCombobox';
import type { TransferWarehouseSelection } from '../types';

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
