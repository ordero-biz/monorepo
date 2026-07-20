import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { createAttributeValuesDefaultValues } from '../constants';
import { submitCreateAttributeValues } from '../utils/submitAction';

type UseCreateAttributeValuesFormArgs = {
  attributeId: string | number;
  onAdded: () => Promise<void> | void;
};

export const useCreateAttributeValuesForm = ({
  attributeId,
  onAdded,
}: UseCreateAttributeValuesFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createAttributeValuesDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateAttributeValues({
        attributeId,
        value,
      });

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
        description: 'Attribute values were added',
        type: 'success',
      });

      formApi.reset();
      await onAdded();
    },
  });

  return {
    form,
  };
};
