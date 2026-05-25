'use client';

import {
  Button,
  Card,
  TextField,
  Typography,
  useToastManager,
} from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/features/sign-in/utils/error';
import { createStore } from '@/lib/api/client';
import { storesQueryKeys } from '@/lib/hooks/useStoresQuery';

type AddStoreFormValues = {
  name: string;
  subDomain: string;
};

const addStoreDefaultValues: AddStoreFormValues = {
  name: '',
  subDomain: '',
};

const validateRequiredValue = (value: string) =>
  value.trim().length > 0 ? undefined : 'This field is required.';

const submitAddStoreToBackend = async (value: AddStoreFormValues) => {
  const result = await createStore({
    name: value.name.trim(),
    subDomain: value.subDomain.trim(),
  });

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

export const AddStorePage = () => {
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
      router.push('/stores');
    },
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
              <form.Field
                name="subDomain"
                validators={{
                  onChange: ({ value }) => validateRequiredValue(value),
                  onSubmit: ({ value }) => validateRequiredValue(value),
                }}
              >
                {(field) => {
                  const submitError = field.state.meta.errorMap.onSubmit;
                  const changeError = field.state.meta.errorMap.onChange;
                  const submitErrorText = submitError
                    ? getErrorMessage(submitError)
                    : undefined;
                  const changeErrorText =
                    !submitErrorText &&
                    field.state.meta.isBlurred &&
                    changeError
                      ? getErrorMessage(changeError)
                      : undefined;
                  const errorText = submitErrorText ?? changeErrorText;

                  return (
                    <TextField
                      autoComplete="off"
                      errorText={errorText}
                      endAdornment=".ordero.biz"
                      invalid={Boolean(errorText)}
                      label="Subdomain"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => field.handleChange(value)}
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
                  onChange: ({ value }) => validateRequiredValue(value),
                  onSubmit: ({ value }) => validateRequiredValue(value),
                }}
              >
                {(field) => {
                  const submitError = field.state.meta.errorMap.onSubmit;
                  const changeError = field.state.meta.errorMap.onChange;
                  const submitErrorText = submitError
                    ? getErrorMessage(submitError)
                    : undefined;
                  const changeErrorText =
                    !submitErrorText &&
                    field.state.meta.isBlurred &&
                    changeError
                      ? getErrorMessage(changeError)
                      : undefined;
                  const errorText = submitErrorText ?? changeErrorText;

                  return (
                    <TextField
                      autoComplete="organization"
                      errorText={errorText}
                      invalid={Boolean(errorText)}
                      label="Name"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => field.handleChange(value)}
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
          </Card.Content>
        </Card.Root>
      </section>
    </main>
  );
};
