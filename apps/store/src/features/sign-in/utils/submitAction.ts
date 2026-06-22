import { signIn } from '@/lib/client/api';
import type { SignInFormValues } from './validations';

export const submitSignIn = async (value: SignInFormValues) => {
  const result = await signIn(value);

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
