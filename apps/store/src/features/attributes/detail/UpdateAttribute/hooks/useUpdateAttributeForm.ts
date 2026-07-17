import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Attribute } from '@/lib/domain/attributes';
import { submitUpdateAttribute } from '../utils/submitAction';

type UseUpdateAttributeFormArgs = {
  attributeId: string | number;
  initialName: string;
  onUpdated: (attribute: Attribute) => Promise<void> | void;
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

      addToast({
        description: `Attribute ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated(result.data);
    },
  });

  return {
    form,
  };
};
