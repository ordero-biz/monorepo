import { signUp } from '@/lib/client/api';
import type { SignUpFormValues } from './validations';

export const submitSignUp = async (value: SignUpFormValues) => {
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
