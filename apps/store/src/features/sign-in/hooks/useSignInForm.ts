import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { AuthSession } from '@/lib/server/types';
import { signInDefaultValues } from '../constants';
import { submitSignIn } from '../utils/submitAction';

type UseSignInFormArgs = {
  onSignedIn: (session: AuthSession) => Promise<void> | void;
};

export const useSignInForm = ({ onSignedIn }: UseSignInFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: signInDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitSignIn(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors ?? {},
          },
        });

        if (result.error.formError) {
          addToast({
            description: result.error.formError,
            type: 'error',
          });
        }

        return;
      }

      await onSignedIn(result.data);
      formApi.reset({
        ...signInDefaultValues,
        email: value.email,
      });
    },
  });

  return {
    form,
  };
};
