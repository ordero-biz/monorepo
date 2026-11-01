import { type CreateSupplyData, createSupply } from '@/lib/client/api/supplies';

export const submitCreateSupply = (submitData: CreateSupplyData) =>
  createSupply(submitData);
