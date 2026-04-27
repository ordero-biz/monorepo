'use client';

import { Button, PasswordField, TextField, Typography } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { logInDefaultValues } from './constants';
import { getErrorMessage } from './utils/error';
import {
  type LogInFormValues,
  validateLogInEmail,
  validateLogInPassword,
} from './utils/validations';

const gmailEmailRegex = /^[^@\s]+@gmail\.com$/i;

const submitLogInToBackend = async (value: LogInFormValues) => {
  if (!gmailEmailRegex.test(value.email)) {
    return {
      ok: false,
      error: {
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
        formError: undefined,
      },
    };
  }

  return {
    ok: true,
    error: {},
  };
};

export const LogInForm = () => {
  const form = useForm({
    defaultValues: logInDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitLogInToBackend(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors ?? {},
            form: result.error.formError,
          },
        });
        return;
      }

      formApi.reset({
        ...logInDefaultValues,
        email: value.email,
      });
    },
  });

  return (
    <form
      className="flex w-full max-w-[420px] flex-col gap-[var(--space-5)] rounded-[var(--figma-card-radius)] bg-[var(--background-default)] px-[var(--space-3)] py-[var(--space-5)]"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-[var(--space-3)] text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(0,167,111,0)_0%,rgba(0,167,111,0.16)_100%)]">
          <div className="text-[40px] leading-none text-[var(--primary-main)]">
            M.
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-[var(--space-1-5)]">
          <Typography variant="h5">Sign in to your account</Typography>
          <div className="flex items-center justify-center gap-[var(--space-0-5)] text-center">
            <Typography color="text-secondary" variant="body2">
              Don't have an account?
            </Typography>
            <button className="text-[var(--primary-main)]" type="button">
              <Typography color="primary" variant="subtitle2">
                Get started
              </Typography>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-[var(--space-3)]">
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => validateLogInEmail(value),
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
                placeholder="admin@mail.com"
                required
                value={field.state.value}
              />
            );
          }}
        </form.Field>
        <div className="flex w-full flex-col gap-[var(--space-1-5)]">
          <div className="flex w-full items-center">
            <div className="flex-1">
              <button className="ml-auto block text-right" type="button">
                <Typography variant="body2">Forgot password?</Typography>
              </button>
            </div>
          </div>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => validateLogInPassword(value),
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
                />
              );
            }}
          </form.Field>
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
      </div>
    </form>
  );
};
