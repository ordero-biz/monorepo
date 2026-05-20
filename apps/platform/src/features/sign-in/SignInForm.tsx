'use client';

import {
  Button,
  PasswordField,
  TextField,
  Typography,
  useToastManager,
} from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { signIn } from '@/lib/api/client';
import { authQueryKeys } from '@/lib/hooks/useSessionQuery';
import { signInDefaultValues } from './constants';
import { getErrorMessage } from './utils/error';
import {
  type SignInFormValues,
  validateSignInEmail,
  validateSignInPassword,
} from './utils/validations';

const submitSignInToBackend = async (value: SignInFormValues) => {
  const result = await signIn(value);

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

export const SignInForm = () => {
  const queryClient = useQueryClient();
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: signInDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitSignInToBackend(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors ?? {},
            form: result.error.formError,
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

      queryClient.setQueryData(authQueryKeys.session, result.data);
      formApi.reset({
        ...signInDefaultValues,
        email: value.email,
      });
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-[var(--space-4)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => validateSignInEmail(value),
          onSubmit: ({ value }) => validateSignInEmail(value),
        }}
      >
        {(field) => {
          const submitError = field.state.meta.errorMap.onSubmit;
          const changeError = field.state.meta.errorMap.onChange;
          const submitErrorText = submitError
            ? getErrorMessage(submitError)
            : undefined;
          const changeErrorText =
            !submitErrorText && field.state.meta.isBlurred && changeError
              ? getErrorMessage(changeError)
              : undefined;
          const errorText = submitErrorText ?? changeErrorText;

          return (
            <TextField
              autoComplete="email"
              errorText={errorText}
              invalid={Boolean(errorText)}
              label="Email address"
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={(value) => field.handleChange(value)}
              placeholder="example@gmail.com"
              required
              value={field.state.value}
              size="s"
            />
          );
        }}
      </form.Field>

      <div className="flex flex-col gap-[var(--space-1)]">
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => validateSignInPassword(value),
            onSubmit: ({ value }) => validateSignInPassword(value),
          }}
        >
          {(field) => {
            const submitError = field.state.meta.errorMap.onSubmit;
            const changeError = field.state.meta.errorMap.onChange;
            const submitErrorText = submitError
              ? getErrorMessage(submitError)
              : undefined;
            const changeErrorText =
              !submitErrorText && field.state.meta.isBlurred && changeError
                ? getErrorMessage(changeError)
                : undefined;
            const errorText = submitErrorText ?? changeErrorText;

            return (
              <PasswordField
                errorText={errorText}
                invalid={Boolean(errorText)}
                label="Password"
                name={field.name}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
                placeholder="6+ characters"
                required
                value={field.state.value}
                size="s"
              />
            );
          }}
        </form.Field>

        <button className="w-fit text-left" type="button">
          <Typography variant="body2">Forgot password?</Typography>
        </button>
      </div>

      <form.Subscribe
        selector={(state) => [state.values, state.isSubmitting] as const}
      >
        {([_, isSubmitting]) => (
          <Button
            color="inherit"
            disabled={isSubmitting}
            fullWidth
            size="l"
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
