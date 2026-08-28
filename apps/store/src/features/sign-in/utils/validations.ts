import { z } from 'zod';
import { getValidationMessage } from '@/lib/utils/form/validation/message';

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
  return getValidationMessage(signInEmailSchema, value);
};

export const validateSignInPassword = (value: string) => {
  return getValidationMessage(signInPasswordSchema, value);
};
