import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Attribute } from '@/lib/domain/attributes/types';
import {
  getAttributeUpdateChanges,
  submitUpdateAttribute,
} from '../utils/submitAction';

type UseUpdateAttributeFormArgs = {
  attributeId: string | number;
  initialName: string;
  onNoChanges: () => void;
  onUpdated: (attribute: Attribute) => Promise<void> | void;
};

export const useUpdateAttributeForm = ({
  attributeId,
  initialName,
  onNoChanges,
  onUpdated,
}: UseUpdateAttributeFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: {
      name: initialName,
    },
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getAttributeUpdateChanges({
        formValue: value,
        initialName,
      });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateAttribute({
        attributeId,
        submitData: updateChanges,
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
