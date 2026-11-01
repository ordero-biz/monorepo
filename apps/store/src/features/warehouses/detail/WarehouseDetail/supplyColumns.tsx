import { createSupplyColumns } from '@/features/supplies/shared/SupplyTable';
import type { WarehouseSupply } from '@/lib/domain/warehouses/types';

export const supplyColumns = createSupplyColumns<WarehouseSupply>();
