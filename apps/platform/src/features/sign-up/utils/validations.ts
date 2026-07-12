import { z } from 'zod';
import {
  authEmailSchema,
  authPasswordSchema,
} from '@/lib/utils/auth/validations';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const acceptTermsSchema = z
  .boolean()
  .refine((value) => value, 'You must accept the terms to continue.');

export const signUpSchema = z.object({
  acceptTerms: acceptTermsSchema,
  email: authEmailSchema,
  password: authPasswordSchema,
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const validateSignUpEmail = ({ value }: ValidationArgs<string>) => {
  const result = authEmailSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateSignUpPassword = ({ value }: ValidationArgs<string>) => {
  const result = authPasswordSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateAcceptTerms = ({ value }: ValidationArgs<boolean>) => {
  const result = acceptTermsSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
