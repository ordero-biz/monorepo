'use client';

import { Button, TextField } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useAddStoreForm } from './hooks/useAddStoreForm';
import type { AddStoreFormProps } from './types';
import { validateStoreName, validateStoreSubDomain } from './utils/validations';

export const AddStoreForm = ({ onCreated }: AddStoreFormProps) => {
  const { form } = useAddStoreForm({
    onCreated,
  });

  return (
    <form
      className="flex flex-col gap-[var(--space-4)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="subDomain"
        validators={{
          onChange: validateStoreSubDomain,
          onSubmit: validateStoreSubDomain,
        }}
      >
        {(field) => {
          const errorText = getFieldSubmitChangeErrorText(field.state.meta);

          return (
            <TextField
              autoComplete="off"
              errorText={errorText}
              endAdornment=".ordero.biz"
              invalid={Boolean(errorText)}
              label="Subdomain"
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
              placeholder="my-store"
              required
              size="s"
              value={field.state.value}
            />
          );
        }}
      </form.Field>

      <form.Field
        name="name"
        validators={{
          onChange: validateStoreName,
          onSubmit: validateStoreName,
        }}
      >
        {(field) => {
          const errorText = getFieldSubmitChangeErrorText(field.state.meta);

          return (
            <TextField
              autoComplete="organization"
              errorText={errorText}
              invalid={Boolean(errorText)}
              label="Name"
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
              placeholder="My Store"
              required
              size="s"
              value={field.state.value}
            />
          );
        }}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            color="inherit"
            disabled={isSubmitting}
            fullWidth
            size="l"
            type="submit"
          >
            {isSubmitting ? 'Creating store...' : 'Create store'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
