'use client';

import {
  Button,
  Checkbox,
  PasswordField,
  TextField,
  Typography,
} from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { getErrorMessage } from '@/features/sign-in/utils/error';
import { signUpDefaultValues } from './constants';
import {
  validateAcceptTerms,
  validateSignUpEmail,
  validateSignUpPassword,
} from './utils/validations';

export const SignUpForm = () => {
  const form = useForm({
    defaultValues: signUpDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      formApi.reset({
        ...signUpDefaultValues,
        email: value.email,
      });
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-[var(--space-4)]"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => validateSignUpEmail(value),
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
