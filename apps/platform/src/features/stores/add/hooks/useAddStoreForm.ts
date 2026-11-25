import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { addStoreDefaultValues } from '../constants';
import { submitAddStore } from '../utils/submitAction';

type UseAddStoreFormArgs = {
  onCreated: () => Promise<void> | void;
};

export const useAddStoreForm = ({ onCreated }: UseAddStoreFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: addStoreDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitAddStore(value);

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

      addToast({
        description: 'Store created.',
        type: 'success',
      });

      formApi.reset();
      await onCreated();
    },
  });

  return {
    form,
  };
};
