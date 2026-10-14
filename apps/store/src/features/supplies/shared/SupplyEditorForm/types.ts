import type { ProductVariant } from '@/lib/domain/products/types';
import type { Supplier } from '@/lib/domain/suppliers/types';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { Warehouse } from '@/lib/domain/warehouses/types';
import type { useSubmitSupplyForm } from './hooks/useSubmitSupplyForm';

export type SupplySupplierSelection = Pick<Supplier, 'id' | 'name' | 'status'>;

export type SupplyWarehouseSelection = Pick<
  Warehouse,
  'id' | 'name' | 'status'
>;

export type SupplyProductVariantSelection = Pick<
  ProductVariant,
  'id' | 'name' | 'sku' | 'status'
>;

export type SupplyUnitOfMeasurementSelection = Pick<
  UnitOfMeasurement,
  'id' | 'name' | 'symbol' | 'status'
>;

export type SupplyEntryFormValues = {
  clientId: string;
  productVariant: SupplyProductVariantSelection | null;
  unitOfMeasurement: SupplyUnitOfMeasurementSelection | null;
  quantity: string;
  unitPrice: string;
  comment: string;
};

export type SupplyFormValues = {
  supplier: SupplySupplierSelection | null;
  warehouse: SupplyWarehouseSelection | null;
  supplyNumber: string;
  supplierInvoiceNumber: string;
  comment: string;
  supplyEntries: SupplyEntryFormValues[];
};

export type SupplyInformationProps = {
  form: ReturnType<typeof useSubmitSupplyForm>['form'];
};

export type SupplyEntriesProps = {
  entries: SupplyEntryFormValues[];
  form: ReturnType<typeof useSubmitSupplyForm>['form'];
  pendingIntent: SupplySubmitIntent | null;
  onSaveDraft: () => void;
  onFinalize: () => void;
};

export type SupplySubmitIntent = 'draft' | 'finalize';

export type SupplyActionsProps = {
  count: number;
  deleteDisabled?: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  total: number;
  pendingIntent: SupplySubmitIntent | null;
  onSaveDraft: () => void;
  onFinalize: () => void;
};

export type SupplyEditorFormProps = {
  form: ReturnType<typeof useSubmitSupplyForm>['form'];
  submit: ReturnType<typeof useSubmitSupplyForm>['submit'];
  pendingIntent: SupplySubmitIntent | null;
};
