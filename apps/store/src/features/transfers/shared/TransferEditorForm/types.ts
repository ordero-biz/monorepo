import type { ApiResult } from '@ordero/api-types';
import type { ReactNode, Ref } from 'react';
import type {
  TransferDetails,
  TransferStatus,
} from '@/lib/domain/transfers/types';
import type {
  WarehouseProductSelection,
  WarehouseSelection,
} from '@/lib/domain/warehouses/types';
import type { useSubmitTransferForm } from './hooks/useSubmitTransferForm';

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

export type TransferForm = ReturnType<typeof useSubmitTransferForm>['form'];

export type UseSubmitTransferFormArgs = {
  defaultValues: TransferFormValues;
  draftSuccessMessage: string;
  submitAction: (args: {
    value: TransferFormValues;
    status: TransferStatus;
  }) => Promise<ApiResult<TransferDetails> | null>;
  onSaved: (transfer: TransferDetails) => Promise<void> | void;
};

export type TransferEditorFormProps = {
  form: TransferForm;
  submit: ReturnType<typeof useSubmitTransferForm>['submit'];
  pendingIntent: TransferSubmitIntent | null;
  onSourceWarehouseChange: (
    warehouse: TransferWarehouseSelection | null
  ) => void;
  sourceWarehouseRef?: Ref<HTMLInputElement>;
  children?: ReactNode;
};

export type TransferInformationProps = {
  disabled: boolean;
  form: TransferForm;
  onSourceWarehouseChange: (
    warehouse: TransferWarehouseSelection | null
  ) => void;
  sourceWarehouseRef?: Ref<HTMLInputElement>;
};

export type PendingSourceWarehouseChange = {
  warehouse: TransferWarehouseSelection | null;
};

export type SourceWarehouseChangeDialogProps = {
  pendingChange: PendingSourceWarehouseChange | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export type StartTransferDialogProps = {
  disabled?: boolean;
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
  onTransfer: () => void;
};

export type TransferActionsProps = {
  deleteDisabled: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  pendingIntent: TransferSubmitIntent | null;
  onSaveDraft: () => void;
  onTransfer: () => void;
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
