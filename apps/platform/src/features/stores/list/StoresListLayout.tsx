'use client';

import { Typography } from '@ordero/ui';
import { StoresList } from './StoresList';

export const StoresListLayout = () => {
  return (
    <main className="min-h-screen bg-[var(--background-neutral)] px-[var(--space-3)] py-[var(--space-5)] text-foreground">
      <section className="mx-auto flex w-full max-w-[760px] flex-col gap-[var(--space-3)]">
        <div className="flex flex-col gap-[var(--space-1)]">
          <Typography variant="h4">Stores</Typography>
          <Typography color="secondary" variant="body2">
            Manage the storefronts connected to your workspace.
          </Typography>
        </div>

        <StoresList />
      </section>
    </main>
  );
};
