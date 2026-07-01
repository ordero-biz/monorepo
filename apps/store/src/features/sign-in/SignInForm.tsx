'use client';

import { Button, PasswordField, TextField, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '@/lib/hooks/auth/useSessionQuery';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useSignInForm } from './hooks/useSignInForm';
import {
  validateSignInEmail,
  validateSignInPassword,
} from './utils/validations';

export const SignInForm = () => {
  const queryClient = useQueryClient();
  const { form } = useSignInForm({
    onSignedIn: (session) => {
      queryClient.setQueryData(authQueryKeys.session, session);
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
          const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
            onChange: ({ value }) => validateSignInPassword(value),
            onSubmit: ({ value }) => validateSignInPassword(value),
          }}
        >
          {(field) => {
            const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
                size="s"
                value={field.state.value}
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
