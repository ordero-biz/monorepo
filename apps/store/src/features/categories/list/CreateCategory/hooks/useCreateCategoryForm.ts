import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Category } from '@/lib/domain/categories';
import { createCategoryDefaultValues } from '../constants';
import { submitCreateCategory } from '../utils/submitAction';

type UseCreateCategoryFormArgs = {
  onCreated: (category: Category) => Promise<void> | void;
};

export const useCreateCategoryForm = ({
  onCreated,
}: UseCreateCategoryFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createCategoryDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateCategory(value);

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
        description: `Category ${result.data.name} was added`,
        type: 'success',
      });

      formApi.reset();
      await onCreated(result.data);
    },
  });

  return {
    form,
  };
};
