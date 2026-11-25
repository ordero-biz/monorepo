import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import {
  validateCategoryName,
  validateCategoryParent,
  validateCategoryStatus,
} from './validations';

describe('category validations', () => {
  it('rejects a whitespace-only category name', () => {
    expect(validateCategoryName({ value: '   ' })).toBe(
      'Category name is required'
    );
  });

  it('accepts a non-empty category name', () => {
    expect(validateCategoryName({ value: 'Sneakers' })).toBeUndefined();
  });

  it('accepts a selected or absent parent category', () => {
    expect(
      validateCategoryParent({ value: { id: 1, name: 'Shoes' } })
    ).toBeUndefined();
    expect(validateCategoryParent({ value: null })).toBeUndefined();
  });

  it('accepts an active or draft category status', () => {
    expect(
      validateCategoryStatus({ value: CATEGORY_STATUS.ACTIVE })
    ).toBeUndefined();
    expect(
      validateCategoryStatus({ value: CATEGORY_STATUS.DRAFT })
    ).toBeUndefined();
  });
});
