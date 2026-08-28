import type { WAREHOUSE_STATUS } from './constants';

export type WarehouseStatus =
  (typeof WAREHOUSE_STATUS)[keyof typeof WAREHOUSE_STATUS];

export type Warehouse = {
  id: number;
  name: string;
  address?: string | null;
  comment: string;
  status?: WarehouseStatus;
};
