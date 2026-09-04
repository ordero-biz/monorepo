'use client';

import { useRouter } from 'next/navigation';
import { getAddProductRoute } from '@/lib/client/routes';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import {
  PRODUCT_CREATION_MODE,
  PRODUCTS_LIST_MODE,
} from '@/lib/domain/products/constants';
import { PageHeader, SplitButton, ToggleButton, Typography } from '@/ui/index';
import { productsRootBreadcrumb } from '../../shared/breadcrumbs';
import type { ProductsListHeaderProps, ProductsListMode } from './types';

export const ProductsListHeader = ({
  listMode,
  onListModeChange,
}: ProductsListHeaderProps) => {
  const router = useRouter();

  const handleListModeChange = (value: string[]) => {
    const nextListMode =
      (value[0] as ProductsListMode | undefined) ??
      PRODUCTS_LIST_MODE.productVariants;
    onListModeChange(nextListMode);
  };

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <Typography variant="h5">Products list</Typography>
          <AppBreadcrumbs
            items={[
              {
                id: productsRootBreadcrumb.id,
                label: productsRootBreadcrumb.label,
              },
            ]}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        <ToggleButton.Group
          aria-label="Product list mode"
          onValueChange={handleListModeChange}
          orientation="horizontal"
          size="s"
          value={[listMode]}
        >
          <ToggleButton.Item value={PRODUCTS_LIST_MODE.productVariants}>
            Product Variants
          </ToggleButton.Item>
          <ToggleButton.Item value={PRODUCTS_LIST_MODE.productGroups}>
            Product Groups
          </ToggleButton.Item>
        </ToggleButton.Group>
        <div aria-hidden="true" className="h-[var(--space-4)] w-px bg-border" />
        <SplitButton.Root aria-label="Create product" color="primary">
          <SplitButton.Action
            onClick={() =>
              router.push(getAddProductRoute(PRODUCT_CREATION_MODE.single))
            }
          >
            Add single product
          </SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose product creation mode" />
          <SplitButton.Content>
            <SplitButton.Item
              onClick={() =>
                router.push(getAddProductRoute(PRODUCT_CREATION_MODE.single))
              }
            >
              Add single product
            </SplitButton.Item>
            <SplitButton.Item
              onClick={() =>
                router.push(getAddProductRoute(PRODUCT_CREATION_MODE.multiple))
              }
            >
              Add multiple products
            </SplitButton.Item>
          </SplitButton.Content>
        </SplitButton.Root>
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
