'use client';

import { Button, Card, Typography } from '@ordero/ui';
import { useSupplierQuery } from '@/lib/hooks/suppliers/useSupplierQuery';
import { SupplierDetailHeader } from './SupplierDetailHeader';
import { SupplierDetailInfo } from './SupplierDetailInfo';

type SupplierDetailProps = {
  supplierId: string;
};

export const SupplierDetail = ({ supplierId }: SupplierDetailProps) => {
  const supplierQuery = useSupplierQuery(supplierId);

  if (supplierQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading supplier...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (supplierQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this supplier right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => supplierQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <SupplierDetailHeader supplier={supplierQuery.data} />
      <SupplierDetailInfo supplier={supplierQuery.data} />
    </div>
  );
};
