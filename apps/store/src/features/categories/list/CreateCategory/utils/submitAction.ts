import { createCategory } from '@/lib/client/api/categories';
import type { CreateCategoryFormValues } from './validations';

const normalizeCreateCategoryFormData = (data: CreateCategoryFormValues) => ({
  name: data.name.trim(),
  parentId: data.parentId ? Number(data.parentId) : null,
  status: data.status,
});

export const submitCreateCategory = async (value: CreateCategoryFormValues) => {
  const normalizedFormData = normalizeCreateCategoryFormData(value);
  const result = await createCategory(normalizedFormData);

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
