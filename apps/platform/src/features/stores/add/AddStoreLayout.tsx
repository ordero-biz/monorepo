'use client';

import { Card, Typography } from '@ordero/ui';
import { AddStoreForm } from './AddStoreForm';

export const AddStoreLayout = () => {
  return (
    <section className="mx-auto flex w-full max-w-[560px] flex-col gap-[var(--space-3)] text-foreground">
      <div className="flex flex-col gap-[var(--space-1)]">
        <Typography variant="h4">Add store</Typography>
        <Typography color="secondary" variant="body2">
          Choose the storefront domain and name shown in your workspace.
        </Typography>
      </div>

      <Card.Root variant="filled">
        <Card.Content>
          <AddStoreForm />
        </Card.Content>
      </Card.Root>
    </section>
  );
};
