export const WAREHOUSE_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export type WarehouseStatus =
  (typeof WAREHOUSE_STATUS)[keyof typeof WAREHOUSE_STATUS];

export type Warehouse = {
  id: number;
  code: string;
  name: string;
  address: string;
  comment: string;
  status?: WarehouseStatus;
};
