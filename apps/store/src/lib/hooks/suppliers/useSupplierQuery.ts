'use client';

import { useQuery } from '@tanstack/react-query';
import { getSupplier } from '@/lib/client/api/suppliers';
import { supplierQueryOptions } from '@/lib/query/suppliers/suppliersQueryOptions';

export const useSupplierQuery = (supplierId: string | number) =>
  useQuery(supplierQueryOptions(supplierId, getSupplier));
