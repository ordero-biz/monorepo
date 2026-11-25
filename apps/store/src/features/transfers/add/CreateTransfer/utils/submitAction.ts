import {
  type CreateTransferData,
  createTransfer,
} from '@/lib/client/api/transfers';

export const submitCreateTransfer = (submitData: CreateTransferData) =>
  createTransfer(submitData);
