import { createCategory } from '@/lib/client/api/categories';
import type { CreateCategoryFormValues } from './validations';

const normalizeCreateCategoryFormData = (data: CreateCategoryFormValues) => {
  const parentId = data.parentId ? Number(data.parentId) : undefined;

  return {
    name: data.name.trim(),
    status: data.status,
    ...(parentId !== undefined ? { parentId } : {}),
  };
};

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
