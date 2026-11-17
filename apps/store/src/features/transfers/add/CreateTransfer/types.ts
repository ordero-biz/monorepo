import type { Ref } from 'react';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type {
  WarehouseSelection,
  WarehouseStockItem,
} from '@/lib/domain/warehouses/types';
import type { useCreateTransferForm } from './hooks/useCreateTransferForm';

export type TransferWarehouseSelection = WarehouseSelection;

/** One stock line of the source warehouse: a product variant in one unit. */
export type TransferStockItemSelection = {
  productVariant: Pick<
    WarehouseStockItem['productVariant'],
    'id' | 'name' | 'sku'
  >;
  unitOfMeasurement: Pick<UnitOfMeasurement, 'id' | 'name' | 'symbol'>;
  available: number;
};

export type TransferEntryFormValues = {
  clientId: string;
  stockItem: TransferStockItemSelection | null;
  quantity: number | undefined;
  comment: string;
};

export type TransferFormValues = {
  transferNumber: string;
  sourceWarehouse: TransferWarehouseSelection | null;
  destinationWarehouse: TransferWarehouseSelection | null;
  comment: string;
  transferEntries: TransferEntryFormValues[];
};

export type TransferForm = ReturnType<typeof useCreateTransferForm>['form'];

export type CreateTransferProps = {
  sourceWarehouseId?: number;
};

export type CreateTransferFormProps = {
  sourceWarehouse: TransferWarehouseSelection | null;
};

export type PendingSourceWarehouseChange = {
  warehouse: TransferWarehouseSelection | null;
};

export type TransferInformationProps = {
  form: TransferForm;
  onSourceWarehouseChange: (
    warehouse: TransferWarehouseSelection | null
  ) => void;
  sourceWarehouseRef: Ref<HTMLInputElement>;
};

export type SourceWarehouseChangeDialogProps = {
  pendingChange: PendingSourceWarehouseChange | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export type TransferEntriesProps = {
  entries: TransferEntryFormValues[];
  form: TransferForm;
};

export type TransferActionsProps = {
  count: number;
  units: number;
  deleteDisabled: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
};

export type UseCreateTransferFormArgs = {
  defaultValues: TransferFormValues;
};

export type TransferWarehouseReviewDialogProps = {
  onClose: () => void;
  onSelect: (warehouse: TransferWarehouseSelection) => void;
  warehouse: TransferWarehouseSelection | null;
};

export type ReviewTransferWarehouseProps = {
  onBusyChange: (isPublishing: boolean) => void;
  onSelect: (warehouse: TransferWarehouseSelection) => void;
  warehouse: TransferWarehouseSelection;
};
