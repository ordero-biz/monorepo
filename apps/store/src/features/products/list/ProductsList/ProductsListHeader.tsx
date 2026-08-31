'use client';

import { useRouter } from 'next/navigation';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { clientRoutes } from '@/lib/client/routes';
import { PRODUCTS_LIST_MODE } from '@/lib/domain/products/constants';
import { Button, PageHeader, ToggleButton, Typography } from '@/ui/index';
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
          <StoreBreadcrumbs items={[{ id: 'product', label: 'Product' }]} />
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
        <Button
          color="primary"
          onClick={() => router.push(clientRoutes.addProduct)}
          type="button"
        >
          Add Product
        </Button>
      </PageHeader.Right>
    </PageHeader.Root>
  );
};
