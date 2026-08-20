import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Category } from '@/lib/domain/categories/types';
import { getCategoryDefaultValues } from '../utils/fields';
import {
  getCategoryUpdateChanges,
  submitUpdateCategory,
} from '../utils/submitAction';

type UseUpdateCategoryFormArgs = {
  category: Category;
  onNoChanges: () => void;
  onUpdated: (category: Category) => Promise<void> | void;
};

export const useUpdateCategoryForm = ({
  category,
  onNoChanges,
  onUpdated,
}: UseUpdateCategoryFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getCategoryDefaultValues(category),
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getCategoryUpdateChanges({ category, formValue: value });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateCategory({
        categoryId: category.id,
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
        description: `Category ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated(result.data);
    },
  });

  return { form };
};
