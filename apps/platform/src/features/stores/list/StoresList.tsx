'use client';

import { Button, Card, Typography } from '@ordero/ui';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { useStoresQuery } from '@/lib/hooks/useStoresQuery';
import { AddStoreCard } from './AddStoreCard';
import { StoreCard } from './StoreCard';

export const StoresList = () => {
  const router = useRouter();
  const storesQuery = useStoresQuery();

  if (storesQuery.isPending) {
    return (
      <div className="flex flex-col gap-[var(--space-2)]">
        <Card.Root variant="filled">
          <Card.Content>
            <Typography color="secondary" variant="body2">
              Loading stores...
            </Typography>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  if (storesQuery.isError) {
    return (
      <div className="flex flex-col gap-[var(--space-2)]">
        <Card.Root variant="filled">
          <Card.Content>
            <div className="flex flex-col gap-[var(--space-2)]">
              <Typography variant="body2">
                We couldn&apos;t load your stores right now.
              </Typography>
              <Button
                color="inherit"
                onClick={() => storesQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  if (storesQuery.data.length === 0) {
    return (
      <div className="flex flex-col gap-[var(--space-2)]">
        <AddStoreCard onClick={() => router.push(clientRoutes.addStore)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {storesQuery.data.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
};
