import type { AsyncCombobox2SingleProps } from '@/lib/components/AsyncCombobox2';
import type {
  SupplyProductVariantSelection,
  SupplySupplierSelection,
  SupplyUnitOfMeasurementSelection,
  SupplyWarehouseSelection,
} from '../types';

type ResourceAsyncCombobox2Props<TOption extends object> = Omit<
  AsyncCombobox2SingleProps<TOption>,
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
  ResourceAsyncCombobox2Props<SupplySupplierSelection>;
export type WarehousesAsyncComboboxProps =
  ResourceAsyncCombobox2Props<SupplyWarehouseSelection>;
export type ProductVariantsAsyncComboboxProps =
  ResourceAsyncCombobox2Props<SupplyProductVariantSelection>;
export type UnitsOfMeasurementAsyncComboboxProps =
  ResourceAsyncCombobox2Props<SupplyUnitOfMeasurementSelection>;
