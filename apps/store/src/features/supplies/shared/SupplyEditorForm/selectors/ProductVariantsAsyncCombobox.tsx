'use client';

import { Chip } from '@ordero/ui';
import { getProductVariants } from '@/lib/client/api/products';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { productVariantsQueryKeys } from '@/lib/query/products/productsQueryKeys';
import type { ProductVariantsAsyncComboboxProps } from './types';

const loadProductVariantOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<AsyncComboboxLoadOptionsResult> => {
  const result = await getProductVariants({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map((variant) => ({
      data: variant,
      displayValue: variant.name,
      label: (
        <span className="flex min-w-0 items-center gap-[var(--space-1)]">
          <span className="truncate">
            {variant.sku ? `${variant.name} · ${variant.sku}` : variant.name}
          </span>
          {variant.status === 'DRAFT' ? (
            <Chip size="s" variant="soft">
              Draft
            </Chip>
          ) : null}
        </span>
      ),
      value: String(variant.id),
    })),
  };
};

export const ProductVariantsAsyncCombobox = (
  props: ProductVariantsAsyncComboboxProps
) => (
  <AsyncCombobox
    {...props}
    emptyText="No products found"
    loadErrorText="We couldn't load products right now."
    loadOptions={loadProductVariantOptions}
    loadingText="Loading products..."
    pageSize={100}
    queryKey={productVariantsQueryKeys.options()}
  />
);
