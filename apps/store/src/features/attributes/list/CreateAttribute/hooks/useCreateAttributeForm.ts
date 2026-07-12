import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { createAttributeDefaultValues } from '../constants';
import { submitCreateAttribute } from '../utils/submitAction';

type UseCreateAttributeFormArgs = {
  onCreated: (attributeId: number) => Promise<void> | void;
};

export const useCreateAttributeForm = ({
  onCreated,
}: UseCreateAttributeFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createAttributeDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateAttribute(value);

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
        description: `Attribute ${result.data.name} was created`,
        type: 'success',
      });

      formApi.reset();
      await onCreated(result.data.id);
    },
  });

  return {
    form,
  };
};
