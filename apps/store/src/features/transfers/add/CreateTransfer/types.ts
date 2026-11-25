import type { TransferWarehouseSelection } from '../../shared/TransferEditorForm';

export type CreateTransferProps = {
  sourceWarehouseId?: number;
};

export type CreateTransferFormProps = {
  sourceWarehouse: TransferWarehouseSelection | null;
};
