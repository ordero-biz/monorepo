import {updateCategory, UpdateCategoryFieldData} from '@/lib/client/api/categories';
import type { Category } from '@/lib/domain/categories/types';
import { createPatchPayload } from '@/lib/utils/form/patch/createPatchPayload';
import type { UpdateCategoryFormValues } from './validations';
import { getCategoryDefaultValues } from './fields';

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
  createPatchPayload({
    initialData: normalizeUpdateCategoryFormData(getCategoryDefaultValues(category)),
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
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
