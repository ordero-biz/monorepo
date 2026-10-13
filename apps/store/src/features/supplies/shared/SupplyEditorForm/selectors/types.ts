import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';

type ResourceAsyncComboboxProps = Omit<
  AsyncComboboxSingleProps,
  | 'emptyText'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
>;

export type SuppliersAsyncComboboxProps = ResourceAsyncComboboxProps;
export type WarehousesAsyncComboboxProps = ResourceAsyncComboboxProps;
export type ProductVariantsAsyncComboboxProps = ResourceAsyncComboboxProps;
export type UnitsOfMeasurementAsyncComboboxProps = ResourceAsyncComboboxProps;
