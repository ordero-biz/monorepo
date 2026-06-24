import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { AuthSession } from '@/lib/api/types';
import { signUpDefaultValues } from '../constants';
import { submitSignUp } from '../utils/submitAction';

type UseSignUpFormArgs = {
  onSignedUp: (session: AuthSession) => Promise<void> | void;
};

export const useSignUpForm = ({ onSignedUp }: UseSignUpFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: signUpDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitSignUp(value);

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

      await onSignedUp(result.data);
    },
  });

  return {
    form,
  };
};
