import { Button, InputField } from '@ordero/ui';
import { useForm, type Validator } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import type { SubmitEvent } from 'react';
import { type SignInFormData, signInSchema } from './validation';

export const SignIn = () => {
  const form = useForm<SignInFormData, Validator<SignInFormData>>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const response = await fetch('/api/v1/platform/owners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value.email,
          password: value.password,
        }),
      });

      if (!response.ok) {
        console.error('Failed to sign ip:', response.statusText);
        return;
      }

      const result = await response.json();

      console.log(result);
    },
    validatorAdapter: zodValidator(),
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <div className="mx-auto mt-[15%] w-full">
      <h2 className="mb-6 text-2xl md:text-3xl font-medium leading-10 tracking-[-0.03em]  text-center">
        Sign in to your account
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mx-auto max-w-90 md:max-w-80"
      >
        <form.Field
          name="email"
          validators={{
            onChange: signInSchema.shape.email,
          }}
        >
          {(field) => (
            <InputField
              id={field.name}
              name={field.name}
              label="Email"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              placeholder="name@service.com"
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: signInSchema.shape.password,
          }}
        >
          {(field) => (
            <InputField
              id={field.name}
              name={field.name}
              label="Password"
              type="password"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              placeholder="*******"
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="dark"
              size="lg"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};
