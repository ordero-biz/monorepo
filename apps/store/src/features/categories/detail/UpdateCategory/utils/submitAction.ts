import { updateCategory } from '@/lib/client/api/categories';

type SubmitUpdateCategoryArgs = {
  categoryId: string | number;
  submitData: {
    name?: string;
    parentId?: number | null;
  };
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
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
