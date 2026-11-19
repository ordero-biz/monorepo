import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type { WarehouseProductSelection } from '@/lib/domain/warehouses/types';

export type WarehouseProductsAsyncComboboxProps = Pick<
  AsyncComboboxSingleProps<WarehouseProductSelection>,
  | 'aria-label'
  | 'disabled'
  | 'errorText'
  | 'invalid'
  | 'name'
  | 'onBlur'
  | 'onValueChange'
  | 'placeholder'
  | 'required'
  | 'size'
  | 'value'
> & {
  disabledProductKeys?: readonly string[];
  warehouseId: number | null;
};
