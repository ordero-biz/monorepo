'use client';

import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { Button, PageHeader, ToggleButton, Typography } from '@/ui/index';
import { PRODUCTS_LIST_MODE } from './constants';
import type { ProductsListHeaderProps, ProductsListMode } from './types';

export const ProductsListHeader = ({
  listMode,
  onListModeChange,
}: ProductsListHeaderProps) => {
  const router = useRouter();

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">Products list</Typography>
      </PageHeader.Left>
      <PageHeader.Right>
        <ToggleButton.Group
          aria-label="Product list mode"
          onValueChange={(value) =>
            onListModeChange(
              (value[0] as ProductsListMode | undefined) ??
                PRODUCTS_LIST_MODE.products
            )
          }
          orientation="horizontal"
          size="s"
          value={[listMode]}
        >
          <ToggleButton.Item value={PRODUCTS_LIST_MODE.products}>
            Products
          </ToggleButton.Item>
          <ToggleButton.Item value={PRODUCTS_LIST_MODE.productGroups}>
            Products Groups
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
