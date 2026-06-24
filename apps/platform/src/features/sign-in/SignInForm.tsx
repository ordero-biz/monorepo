'use client';

import { Button, PasswordField, TextField, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { authQueryKeys } from '@/lib/hooks/useSessionQuery';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error';
import { useSignInForm } from './hooks/useSignInForm';
import {
  validateSignInEmail,
  validateSignInPassword,
} from './utils/validations';

export const SignInForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { form } = useSignInForm({
    onSignedIn: (session) => {
      queryClient.setQueryData(authQueryKeys.session, session);
      router.push(clientRoutes.stores);
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
          onChange: validateSignInEmail,
          onSubmit: validateSignInEmail,
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
              onValueChange={field.handleChange}
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
            onChange: validateSignInPassword,
            onSubmit: validateSignInPassword,
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
                onValueChange={field.handleChange}
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

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
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
