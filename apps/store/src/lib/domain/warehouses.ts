export const WAREHOUSE_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export type WarehouseStatus =
  (typeof WAREHOUSE_STATUS)[keyof typeof WAREHOUSE_STATUS];

export type Warehouse = {
  id: number;
  name: string;
  address?: string | null;
  comment: string;
  status?: WarehouseStatus;
};
