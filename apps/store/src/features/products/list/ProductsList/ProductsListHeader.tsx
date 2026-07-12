'use client';

import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { Button, PageHeader, Typography } from '@/ui/index';

export const ProductsListHeader = () => {
  const router = useRouter();

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">Products list</Typography>
      </PageHeader.Left>
      <PageHeader.Right>
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
