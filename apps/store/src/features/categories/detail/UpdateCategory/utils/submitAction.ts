import { updateCategory } from '@/lib/client/api/categories';
import type { CategoryFormValues } from '../../../shared/validations';

type SubmitUpdateCategoryArgs = {
  categoryId: string | number;
  value: CategoryFormValues;
};

export const submitUpdateCategory = async ({
  categoryId,
  value,
}: SubmitUpdateCategoryArgs) => {
  const result = await updateCategory({
    categoryId,
    name: value.name.trim(),
    parentId: value.parentId ? Number(value.parentId) : null,
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
