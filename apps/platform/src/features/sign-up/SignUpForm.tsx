'use client';

import {
  Button,
  Checkbox,
  PasswordField,
  TextField,
  Typography,
  useToastManager,
} from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { getErrorMessage } from '@/features/sign-in/utils/error';
import { signUp } from '@/lib/api/client';
import { authQueryKeys } from '@/lib/hooks/useSessionQuery';
import { signUpDefaultValues } from './constants';
import {
  type SignUpFormValues,
  validateAcceptTerms,
  validateSignUpEmail,
  validateSignUpPassword,
} from './utils/validations';

const submitSignUpToBackend = async (value: SignUpFormValues) => {
  const result = await signUp({
    email: value.email,
    password: value.password,
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

export const SignUpForm = () => {
  const queryClient = useQueryClient();
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: signUpDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitSignUpToBackend(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors ?? {},
            form: result.error.formError,
          },
        });
        addToast({
          description: result.error.formError,
          type: 'error',
        });
        return;
      }

      queryClient.setQueryData(authQueryKeys.session, result.data);
      formApi.reset({
        ...signUpDefaultValues,
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
          onChange: ({ value }) => validateSignUpEmail(value),
          onSubmit: ({ value }) => validateSignUpEmail(value),
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
              size="s"
              value={field.state.value}
            />
          );
        }}
      </form.Field>

      <div className="flex flex-col gap-[var(--space-1)]">
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => validateSignUpPassword(value),
            onSubmit: ({ value }) => validateSignUpPassword(value),
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
                autoComplete="new-password"
                errorText={errorText}
                invalid={Boolean(errorText)}
                label="Password"
                name={field.name}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
                placeholder="6+ characters"
                required
                size="s"
                value={field.state.value}
              />
            );
          }}
        </form.Field>

        <form.Field
          name="acceptTerms"
          validators={{
            onSubmit: ({ value }) => validateAcceptTerms(value),
          }}
        >
          {(field) => {
            const submitError = field.state.meta.errorMap.onSubmit;
            const errorText = submitError
              ? getErrorMessage(submitError)
              : undefined;

            return (
              <div className="flex flex-col gap-[var(--space-1)]">
                <Checkbox
                  checked={Boolean(field.state.value)}
                  color="primary"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                  size="s"
                >
                  <span className="text-[var(--text-secondary)]">
                    By signing up, I agree to{' '}
                    <Link
                      className="text-[var(--text-secondary)] underline underline-offset-[3px]"
                      href="/terms"
                    >
                      terms of use
                    </Link>{' '}
                    and{' '}
                    <Link
                      className="text-[var(--text-secondary)] underline underline-offset-[3px]"
                      href="/privacy"
                    >
                      privacy policy
                    </Link>
                    .
                  </span>
                </Checkbox>
                {errorText ? (
                  <Typography color="error" variant="caption">
                    {errorText}
                  </Typography>
                ) : null}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            color="inherit"
            disabled={isSubmitting}
            fullWidth
            size="l"
            type="submit"
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
