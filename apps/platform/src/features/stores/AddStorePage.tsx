'use client';

import { Button, Card, TextField, Typography } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';

type AddStoreFormValues = {
  domain: string;
  name: string;
};

const addStoreDefaultValues: AddStoreFormValues = {
  domain: '',
  name: '',
};

export const AddStorePage = () => {
  const form = useForm({
    defaultValues: addStoreDefaultValues,
    onSubmit: () => undefined,
  });

  return (
    <main className="min-h-screen bg-[var(--background-neutral)] px-[var(--space-3)] py-[var(--space-5)] text-foreground">
      <section className="mx-auto flex w-full max-w-[560px] flex-col gap-[var(--space-3)]">
        <div className="flex flex-col gap-[var(--space-1)]">
          <Typography variant="h4">Add store</Typography>
          <Typography color="secondary" variant="body2">
            Choose the storefront domain and name shown in your workspace.
          </Typography>
        </div>

        <Card.Root variant="filled">
          <Card.Content>
            <form
              className="flex flex-col gap-[var(--space-4)]"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field name="domain">
                {(field) => (
                  <TextField
                    autoComplete="off"
                    endAdornment=".ordero.biz"
                    label="Domain"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={(value) => field.handleChange(value)}
                    placeholder="my-store"
                    required
                    size="s"
                    value={field.state.value}
                  />
                )}
              </form.Field>

              <form.Field name="name">
                {(field) => (
                  <TextField
                    autoComplete="organization"
                    label="Name"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={(value) => field.handleChange(value)}
                    placeholder="My Store"
                    required
                    size="s"
                    value={field.state.value}
                  />
                )}
              </form.Field>

              <Button color="inherit" fullWidth size="l" type="submit">
                Create store
              </Button>
            </form>
          </Card.Content>
        </Card.Root>
      </section>
    </main>
  );
};
