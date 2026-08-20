import { updateCategory } from '@/lib/client/api/categories';
import type { Category } from '@/lib/domain/categories/types';
import { createPatchPayload } from '@/lib/utils/form/patch/createPatchPayload';
import type { CategoryFormValues } from '../../../shared/validations';
import { getCategoryDefaultValues } from './fields';

type SubmitUpdateCategoryArgs = {
  initialData: Category;
  submitData: CategoryFormValues;
};

const normalizeCategoryFormData = (data: CategoryFormValues) => ({
  name: data.name.trim(),
  parentId: data.parentId ? Number(data.parentId) : null,
});

export const submitUpdateCategory = async ({
  initialData,
  submitData,
}: SubmitUpdateCategoryArgs) => {
  const patchPayload = createPatchPayload({
    initialData: normalizeCategoryFormData(
      getCategoryDefaultValues(initialData)
    ),
    submitData: normalizeCategoryFormData(submitData),
  });

  if (!patchPayload) {
    return {
      ok: true,
      data: initialData,
    } as const;
  }

  const result = await updateCategory({
    categoryId: initialData.id,
    ...patchPayload,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
