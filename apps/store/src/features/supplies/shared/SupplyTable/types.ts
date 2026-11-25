import type { DataTableColumnDef } from '@ordero/ui';
import type { Supply } from '@/lib/domain/supplies/types';

export type SupplyTableRow = Pick<
  Supply,
  | 'id'
  | 'supplyNumber'
  | 'supplier'
  | 'supplierInvoiceNumber'
  | 'totalPrice'
  | 'createdAt'
>;

export type CreateSupplyColumnsArgs<T extends SupplyTableRow> = {
  contextColumns?: DataTableColumnDef<T>[];
};
