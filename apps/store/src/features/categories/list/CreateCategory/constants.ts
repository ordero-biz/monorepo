import type { CreateCategoryFormValues } from './utils/validations';
import { CATEGORY_STATUS } from '@/lib/domain/categories';

export const createCategoryDefaultValues: CreateCategoryFormValues = {
  name: '',
  parentId: null,
  status: CATEGORY_STATUS.DRAFT,
};
