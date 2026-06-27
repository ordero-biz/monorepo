'use client';

import { Typography } from '@ordero/ui';
import { StoresList } from './StoresList';

export const StoresListLayout = () => {
  return (
    <section className="mx-auto flex w-full max-w-[760px] flex-col gap-[var(--space-3)] text-foreground">
      <div className="flex flex-col gap-[var(--space-1)]">
        <Typography variant="h4">Stores</Typography>
        <Typography color="secondary" variant="body2">
          Manage the storefronts connected to your workspace.
        </Typography>
      </div>

      <StoresList />
    </section>
  );
};
