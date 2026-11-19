import type { Ref } from 'react';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import type {
  WarehouseProductSelection,
  WarehouseSelection,
} from '@/lib/domain/warehouses/types';
import type { useCreateTransferForm } from './hooks/useCreateTransferForm';

export type TransferWarehouseSelection = WarehouseSelection;

/** One stock line of the source warehouse: a product variant in one unit. */
export type TransferStockItemSelection = WarehouseProductSelection;

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

export type TransferSubmitIntent = 'draft' | 'transfer';

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
  disabled: boolean;
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

export type StartTransferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export type TransferEntriesProps = {
  disabled: boolean;
  entries: TransferEntryFormValues[];
  form: TransferForm;
  pendingIntent: TransferSubmitIntent | null;
  onSaveDraft: () => void;
  onValidateTransfer: () => Promise<boolean>;
  onTransfer: () => void;
};

export type TransferActionsProps = {
  count: number;
  units: number;
  deleteDisabled: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  pendingIntent: TransferSubmitIntent | null;
  onSaveDraft: () => void;
  onValidateTransfer: () => Promise<boolean>;
  onTransfer: () => void;
};

export type UseCreateTransferFormArgs = {
  defaultValues: TransferFormValues;
  onCreated: (transfer: TransferDetails) => Promise<void> | void;
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
