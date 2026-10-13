'use client';

import { Chip } from '@ordero/ui';
import { getSuppliers } from '@/lib/client/api/suppliers';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import type { SuppliersAsyncComboboxProps } from './types';

const loadSupplierOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<AsyncComboboxLoadOptionsResult> => {
  const result = await getSuppliers({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map((supplier) => ({
      data: supplier,
      displayValue: supplier.name,
      label: (
        <span className="flex min-w-0 items-center gap-[var(--space-1)]">
          <span className="truncate">{supplier.name}</span>
          {supplier.status === SUPPLIER_STATUS.DRAFT ? (
            <Chip size="s" variant="soft">
              Draft
            </Chip>
          ) : null}
        </span>
      ),
      value: String(supplier.id),
    })),
  };
};

export const SuppliersAsyncCombobox = (props: SuppliersAsyncComboboxProps) => (
  <AsyncCombobox
    {...props}
    emptyText="No suppliers found"
    loadErrorText="We couldn't load suppliers right now."
    loadOptions={loadSupplierOptions}
    loadingText="Loading suppliers..."
    pageSize={100}
    queryKey={suppliersQueryKeys.options()}
  />
);
