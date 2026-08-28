import type { Category } from '@/lib/domain/categories/types';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import { getCategoryDefaultValues } from './fields';
import type { UpdateCategoryFormValues } from './validations';

type GetUpdateChangesArgs = {
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
}: GetUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateCategoryFormData(
      getCategoryDefaultValues(category)
    ),
    submitData: normalizeUpdateCategoryFormData(formValue),
  });
