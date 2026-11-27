import type { DataTableColumnDef } from '@ordero/ui';
import type { Transfer } from '@/lib/domain/transfers/types';

export type TransferTableRow = Pick<
  Transfer,
  'id' | 'transferNumber' | 'status' | 'createdAt'
>;

export type CreateTransferColumnsArgs<T extends TransferTableRow> = {
  contextColumns?: DataTableColumnDef<T>[];
};
