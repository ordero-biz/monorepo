import { z } from 'zod';

export const signInEmailSchema = z.email('Enter a valid email address.');

export const signInPasswordSchema = z
  .string()
  .min(6, 'Password must contain at least 6 characters.');

export const signInSchema = z.object({
  email: signInEmailSchema,
  password: signInPasswordSchema,
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const validateSignInEmail = (value: string) => {
  const result = signInEmailSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateSignInPassword = (value: string) => {
  const result = signInPasswordSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
