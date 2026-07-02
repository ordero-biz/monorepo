import { createCategory } from '@/lib/client/api/categories';
import type { CreateCategoryFormValues } from './validations';

export const submitCreateCategory = async (value: CreateCategoryFormValues) => {
  const result = await createCategory({
    name: value.name.trim(),
    parentId: value.parentId ? Number(value.parentId) : null,
    sortOrder: Number(value.sortOrder),
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
