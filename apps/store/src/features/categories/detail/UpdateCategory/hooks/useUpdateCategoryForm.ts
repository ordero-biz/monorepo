import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Category } from '@/lib/domain/categories/types';
import { createPatchPayload } from '@/lib/utils/form/patch/createPatchPayload';
import type { CategoryFormValues } from '../../../shared/validations';
import { getCategoryDefaultValues } from '../utils/fields';
import { submitUpdateCategory } from '../utils/submitAction';

type UseUpdateCategoryFormArgs = {
  category: Category;
  handleCloseDialog: () => void;
  onUpdated: (category: Category) => Promise<void> | void;
};

const normalizeCategoryFormData = (data: CategoryFormValues) => ({
  name: data.name.trim(),
  parentId: data.parentId ? Number(data.parentId) : null,
});

export const useUpdateCategoryForm = ({
  category,
  handleCloseDialog,
  onUpdated,
}: UseUpdateCategoryFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getCategoryDefaultValues(category),
    onSubmit: async ({ formApi, value }) => {
      const submitData = createPatchPayload({
        initialData: normalizeCategoryFormData(
          getCategoryDefaultValues(category)
        ),
        submitData: normalizeCategoryFormData(value),
      });

      if (!submitData) {
        handleCloseDialog();
        return;
      }

      const result = await submitUpdateCategory({
        categoryId: category.id,
        submitData,
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
