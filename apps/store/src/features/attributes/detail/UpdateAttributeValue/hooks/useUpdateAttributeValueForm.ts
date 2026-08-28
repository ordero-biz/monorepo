import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import {
  getAttributeValueUpdateChanges,
  submitUpdateAttributeValue,
} from '../utils/submitAction';

type UseUpdateAttributeValueFormArgs = {
  attributeValueId: string | number;
  initialName: string;
  initialSortOrder: number;
  onNoChanges: () => void;
  onUpdated: (attributeValue: AttributeValue) => Promise<void> | void;
};

export const useUpdateAttributeValueForm = ({
  attributeValueId,
  initialName,
  initialSortOrder,
  onNoChanges,
  onUpdated,
}: UseUpdateAttributeValueFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: {
      name: initialName,
      sortOrder: initialSortOrder,
    },
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getAttributeValueUpdateChanges({
        formValue: value,
        initialName,
        initialSortOrder,
      });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateAttributeValue({
        attributeValueId,
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
        description: `Attribute value ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated(result.data);
    },
  });

  return {
    form,
  };
};
