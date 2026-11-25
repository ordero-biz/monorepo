import { z } from 'zod';
import {
  authEmailSchema,
  authPasswordSchema,
} from '@/lib/utils/auth/validations';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const signInSchema = z.object({
  email: authEmailSchema,
  password: authPasswordSchema,
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const validateSignInEmail = ({ value }: ValidationArgs<string>) => {
  const result = authEmailSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateSignInPassword = ({ value }: ValidationArgs<string>) => {
  const result = authPasswordSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
