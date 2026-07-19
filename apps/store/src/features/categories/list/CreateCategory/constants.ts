import type { CreateCategoryFormValues } from './utils/validations';

export const createCategoryDefaultValues: CreateCategoryFormValues = {
  color: '#000000',
  name: '',
  parentId: null,
  sortOrder: '0',
};
