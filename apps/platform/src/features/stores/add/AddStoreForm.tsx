'use client';

import { Button, TextField, useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createStore } from '@/lib/client/api';
import { clientRoutes } from '@/lib/client/routes';
import { storesQueryKeys } from '@/lib/hooks/useStoresQuery';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { addStoreDefaultValues } from './constants';
import {
  type AddStoreFormValues,
  addStoreSchema,
  validateStoreName,
  validateStoreSubDomain,
} from './utils/validations';

const submitAddStoreToBackend = async (value: AddStoreFormValues) => {
  const validatedValue = addStoreSchema.parse(value);
  const result = await createStore(validatedValue);

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};

export const AddStoreForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: addStoreDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitAddStoreToBackend(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors ?? {},
          },
        });

        if (result.error.formError) {
          addToast({
            description: result.error.formError,
            type: 'error',
          });
        }

        return;
      }

      addToast({
        description: 'Store created.',
        type: 'success',
      });
      await queryClient.invalidateQueries({
        queryKey: storesQueryKeys.list,
      });
      router.push(clientRoutes.stores);
    },
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
