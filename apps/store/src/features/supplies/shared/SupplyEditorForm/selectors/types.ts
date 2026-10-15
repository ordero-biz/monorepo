import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type { ProductVariant } from '@/lib/domain/products/types';
import type {
  SupplyProductVariantFormValue,
  SupplySupplierSelection,
  SupplyUnitOfMeasurementSelection,
  SupplyWarehouseSelection,
} from '../types';

export type ProductVariantComboboxOption = {
  id: ProductVariant['id'];
  name: ProductVariant['name'];
  sku: ProductVariant['sku'];
  // The initial selection can be displayed before its option loads.
  status?: ProductVariant['status'];
};

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
  ResourceAsyncComboboxProps<SupplyProductVariantFormValue>;
export type UnitsOfMeasurementAsyncComboboxProps =
  ResourceAsyncComboboxProps<SupplyUnitOfMeasurementSelection>;
