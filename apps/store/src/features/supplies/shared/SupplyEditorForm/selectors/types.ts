import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type {
  SupplyProductVariantSelection,
  SupplySupplierSelection,
  SupplyUnitOfMeasurementSelection,
  SupplyWarehouseSelection,
} from '../types';

type ResourceAsyncComboboxProps<TOption extends object> = Omit<
  AsyncComboboxSingleProps<TOption>,
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
export type SuppliersAsyncComboboxProps =
  ResourceAsyncComboboxProps<SupplySupplierSelection>;
export type WarehousesAsyncComboboxProps =
  ResourceAsyncComboboxProps<SupplyWarehouseSelection>;
export type ProductVariantsAsyncComboboxProps =
  ResourceAsyncComboboxProps<SupplyProductVariantSelection>;
export type UnitsOfMeasurementAsyncComboboxProps =
  ResourceAsyncComboboxProps<SupplyUnitOfMeasurementSelection>;
