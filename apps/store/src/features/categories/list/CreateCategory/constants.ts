import type { CreateCategoryFormValues } from './utils/validations';

export const createCategoryDefaultValues: CreateCategoryFormValues = {
  name: '',
  parentId: null,
  status: 'draft',
};
