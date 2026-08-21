import {
  type UpdateCategoryFieldData,
  updateCategory,
} from '@/lib/client/api/categories';
import type { Category } from '@/lib/domain/categories/types';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import { getCategoryDefaultValues } from './fields';
import type { UpdateCategoryFormValues } from './validations';

type SubmitUpdateCategoryArgs = {
  categoryId: string | number;
  submitData: UpdateCategoryFieldData;
};

type GetCategoryUpdateChangesArgs = {
  category: Category;
  formValue: UpdateCategoryFormValues;
};

const normalizeUpdateCategoryFormData = (data: UpdateCategoryFormValues) => ({
  name: data.name.trim(),
  parentId: data.parentId ? Number(data.parentId) : null,
});

export const getCategoryUpdateChanges = ({
  category,
  formValue,
}: GetCategoryUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateCategoryFormData(
      getCategoryDefaultValues(category)
    ),
    submitData: normalizeUpdateCategoryFormData(formValue),
  });

export const submitUpdateCategory = async ({
  categoryId,
  submitData,
}: SubmitUpdateCategoryArgs) => {
  const result = await updateCategory({
    categoryId,
    ...submitData,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: getApiErrorMessage(result.error),
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
