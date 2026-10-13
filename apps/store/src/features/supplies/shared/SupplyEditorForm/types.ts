import type { useSubmitSupplyForm } from './hooks/useSubmitSupplyForm';

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
