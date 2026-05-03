import { z } from 'zod';
import {
  signInEmailSchema,
  signInPasswordSchema,
} from '@/features/sign-in/utils/validations';

export const acceptTermsSchema = z
  .boolean()
  .refine((value) => value, 'You must accept the terms to continue.');

export const signUpSchema = z.object({
  acceptTerms: acceptTermsSchema,
  email: signInEmailSchema,
  password: signInPasswordSchema,
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const validateSignUpEmail = (value: string) => {
  const result = signInEmailSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateSignUpPassword = (value: string) => {
  const result = signInPasswordSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateAcceptTerms = (value: boolean) => {
  const result = acceptTermsSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
