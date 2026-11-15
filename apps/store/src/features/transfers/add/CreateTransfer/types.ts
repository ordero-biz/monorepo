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
};
