import type { Ref } from 'react';
import type { WarehousesAsyncComboboxProps } from '@/features/warehouses/shared/WarehousesAsyncCombobox';
import type { WarehouseSelection } from '@/lib/domain/warehouses/types';
import type { useCreateTransferForm } from './hooks/useCreateTransferForm';

export type TransferWarehouseSelection = WarehouseSelection;

export type TransferFormValues = {
  transferNumber: string;
  sourceWarehouse: TransferWarehouseSelection | null;
  destinationWarehouse: TransferWarehouseSelection | null;
  comment: string;
};

export type CreateTransferProps = {
  sourceWarehouseId?: number;
};

export type CreateTransferFormProps = {
  sourceWarehouse: TransferWarehouseSelection | null;
};

export type TransferInformationProps = {
  form: ReturnType<typeof useCreateTransferForm>['form'];
  sourceWarehouseRef: Ref<HTMLInputElement>;
};

export type TransferWarehouseComboboxProps = Pick<
  WarehousesAsyncComboboxProps,
  | 'errorText'
  | 'invalid'
  | 'isOptionDisabled'
  | 'label'
  | 'name'
  | 'onBlur'
  | 'placeholder'
  | 'ref'
  | 'required'
  | 'size'
  | 'value'
> & {
  onValueChange: (warehouse: TransferWarehouseSelection | null) => void;
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
