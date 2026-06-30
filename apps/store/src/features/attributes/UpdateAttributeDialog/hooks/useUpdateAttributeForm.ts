import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { submitUpdateAttribute } from '../utils/submitAction';

type UseUpdateAttributeFormArgs = {
  attributeId: string | number;
  initialName: string;
  onUpdated: () => Promise<void> | void;
};

export const useUpdateAttributeForm = ({
  attributeId,
  initialName,
  onUpdated,
}: UseUpdateAttributeFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: {
      name: initialName,
    },
    onSubmit: async ({ formApi, value }) => {
      const result = await submitUpdateAttribute({
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

      await onUpdated();
    },
  });

  return {
    form,
  };
};
