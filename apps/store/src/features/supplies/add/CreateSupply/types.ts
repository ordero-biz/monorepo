import type { SupplyDetails } from '@/lib/domain/supplies/types';
import type { useSupplyEditorForm } from './hooks/useSupplyEditorForm';

export type CreateSupplyProps = {
  initialSupply?: SupplyDetails;
};

export type SupplyEntryFormValues = {
  clientId: string;
  productVariantId: string | null;
  productVariantName: string;
  productVariantSku: string;
  unitOfMeasurementId: string | null;
  unitOfMeasurementName: string;
  quantity: string;
  unitPrice: string;
  comment: string;
};

export type SupplyFormValues = {
  supplierId: string | null;
  supplierName: string;
  warehouseId: string | null;
  warehouseName: string;
  supplyNumber: string;
  supplierInvoiceNumber: string;
  comment: string;
  supplyEntries: SupplyEntryFormValues[];
};

export type SupplyInformationProps = {
  form: ReturnType<typeof useSupplyEditorForm>['form'];
  initialSupply?: SupplyDetails;
  readOnly: boolean;
};

export type SupplyEntriesProps = {
  entries: SupplyEntryFormValues[];
  form: ReturnType<typeof useSupplyEditorForm>['form'];
  readOnly: boolean;
  submit: ReturnType<typeof useSupplyEditorForm>['submit'];
  submitIntent: ReturnType<typeof useSupplyEditorForm>['submitIntent'];
};
