import {
  type UpdateCategoryFieldData,
  updateCategory,
} from '@/lib/client/api/categories';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type SubmitUpdateCategoryArgs = {
  categoryId: string | number;
  submitData: UpdateCategoryFieldData;
};

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
