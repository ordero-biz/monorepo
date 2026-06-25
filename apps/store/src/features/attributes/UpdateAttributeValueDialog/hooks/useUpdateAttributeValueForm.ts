import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { submitUpdateAttributeValue } from '../utils/submitAction';

type UseUpdateAttributeValueFormArgs = {
  attributeValueId: string | number;
  initialName: string;
  initialSortOrder: number;
  onUpdated: () => Promise<void> | void;
};

export const useUpdateAttributeValueForm = ({
  attributeValueId,
  initialName,
  initialSortOrder,
  onUpdated,
}: UseUpdateAttributeValueFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: {
      name: initialName,
      sortOrder: initialSortOrder,
    },
    onSubmit: async ({ formApi, value }) => {
      const result = await submitUpdateAttributeValue({
        attributeValueId,
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

      formApi.reset({
        name: result.data.name,
        sortOrder: result.data.sortOrder,
      });
      await onUpdated();
    },
  });

  return {
    form,
  };
};
