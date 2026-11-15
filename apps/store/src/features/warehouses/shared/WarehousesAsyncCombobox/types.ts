import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type { WarehouseSelection } from '@/lib/domain/warehouses/types';

export type WarehousesAsyncComboboxProps = Omit<
  AsyncComboboxSingleProps<WarehouseSelection>,
  | 'emptyText'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
  | 'getOptionValue'
  | 'getOptionLabel'
  | 'renderOption'
>;
