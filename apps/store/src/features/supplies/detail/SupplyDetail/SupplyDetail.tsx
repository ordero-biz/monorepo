'use client';

import { useSupplyQuery } from '@/lib/hooks/supplies/useSupplyQuery';
import { Button, Card, Typography } from '@/ui/index';
import { UpdateSupply } from '../UpdateSupply';
import type { SupplyDetailProps } from './types';

export const SupplyDetail = ({ supplyId }: SupplyDetailProps) => {
  const supplyQuery = useSupplyQuery(supplyId);

  if (supplyQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading supply...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (supplyQuery.isError && !supplyQuery.data) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this supply right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => supplyQuery.refetch()}
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

  return <UpdateSupply supply={supplyQuery.data} key={supplyQuery.data.id} />;
};
