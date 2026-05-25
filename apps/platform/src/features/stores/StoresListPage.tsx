'use client';

import { Button, Card, IconButton, Typography } from '@ordero/ui';
import { useRouter } from 'next/navigation';
import type { Store } from '@/lib/api/types';
import { useStoresQuery } from '@/lib/hooks/useStoresQuery';

const StoreCard = ({ name, subDomain }: Store) => (
  <Card.Root variant="filled">
    <div className="relative flex flex-col gap-[var(--spacing-2)] px-[var(--card-content-p)] pt-[var(--card-content-p)] pb-[var(--spacing-2)]">
      <div className="flex size-[48px] select-none items-center justify-center overflow-hidden rounded-[var(--avatar-rounded-radius)] bg-primary text-primary-foreground">
        <span className="text-sm font-bold leading-none">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col items-start gap-[var(--spacing-1)]">
        <h3 className="text-[length:var(--subtitle1-size-desktop)] font-semibold leading-[var(--subtitle1-line-height-desktop)] text-[color:var(--text-primary)]">
          {name}
        </h3>

        <div className="mt-[var(--spacing-0-5)] flex items-center gap-[var(--spacing-0-5)]">
          <span
            className="size-[16px] rounded-[var(--radius-50)] border border-[var(--primary-dark)]"
            aria-hidden="true"
          />
          <span className="text-[length:var(--caption-size-desktop)] font-semibold leading-[var(--caption-line-height-desktop)] text-[color:var(--primary-dark)]">
            {subDomain}.ordero.biz
          </span>
        </div>
      </div>

      <div className="absolute right-[var(--spacing-1)] top-[var(--spacing-1)] p-[var(--spacing-1)]">
        <IconButton color="inherit" size="s" aria-label={`${name} options`}>
          <span aria-hidden="true">...</span>
        </IconButton>
      </div>
    </div>
  </Card.Root>
);

export const StoresListPage = () => {
  const router = useRouter();
  const storesQuery = useStoresQuery();

  const renderContent = () => {
    if (storesQuery.isPending) {
      return (
        <Card.Root variant="filled">
          <Card.Content>
            <Typography color="secondary" variant="body2">
              Loading stores...
            </Typography>
          </Card.Content>
        </Card.Root>
      );
    }

    if (storesQuery.isError) {
      return (
        <Card.Root variant="filled">
          <Card.Content>
            <div className="flex flex-col gap-[var(--space-2)]">
              <Typography variant="body2">
                We couldn&apos;t load your stores right now.
              </Typography>
              <Button
                color="inherit"
                onClick={() => void storesQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      );
    }

    if (storesQuery.data.length > 0) {
      return storesQuery.data.map((store) => (
        <StoreCard key={store.id} {...store} />
      ));
    }

    return (
      <Card.Root variant="filled" onClick={() => router.push('/stores/add')}>
        <Card.Header>
          <div>
            <Card.Title>Add your first store</Card.Title>
            <Card.Description>
              Create a store domain and display name.
            </Card.Description>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="flex min-h-[140px] flex-col items-center justify-center gap-[var(--spacing-1-5)] rounded-[var(--button-radius)] border border-dashed border-[var(--color-divider)] bg-[var(--color-grey-8)] p-[var(--spacing-2)]">
            <span className="inline-flex size-[var(--icon-button-lg-size)] items-center justify-center rounded-[var(--icon-button-radius)] text-primary">
              <span
                className="text-[length:var(--h5-size-desktop)] font-semibold leading-none"
                aria-hidden="true"
              >
                +
              </span>
            </span>
            <span className="text-[length:var(--caption-size-desktop)] font-medium leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)]">
              Add store
            </span>
          </div>
        </Card.Content>
      </Card.Root>
    );
  };

  return (
    <main className="min-h-screen bg-[var(--background-neutral)] px-[var(--space-3)] py-[var(--space-5)] text-foreground">
      <section className="mx-auto flex w-full max-w-[760px] flex-col gap-[var(--space-3)]">
        <div className="flex flex-col gap-[var(--space-1)]">
          <Typography variant="h4">Stores</Typography>
          <Typography color="secondary" variant="body2">
            Manage the storefronts connected to your workspace.
          </Typography>
        </div>

        <div className="flex flex-col gap-[var(--space-2)]">
          {renderContent()}
        </div>
      </section>
    </main>
  );
};
