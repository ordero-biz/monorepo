import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { CreateCategoryFormValues } from './utils/validations';

export const createCategoryDefaultValues: CreateCategoryFormValues = {
  name: '',
  parentId: null,
  status: CATEGORY_STATUS.DRAFT,
};
