import { validateCategoryName, validateCategoryParentId } from './validations';

describe('validateCategoryName', () => {
  it('rejects a whitespace-only category name', () => {
    expect(validateCategoryName({ value: '   ' })).toBe(
      'Category name is required'
    );
  });

  it('accepts a non-empty category name', () => {
    expect(validateCategoryName({ value: 'Sneakers' })).toBeUndefined();
  });
});

describe('validateCategoryParentId', () => {
  it('accepts a selected or absent parent category', () => {
    expect(validateCategoryParentId({ value: '1' })).toBeUndefined();
    expect(validateCategoryParentId({ value: null })).toBeUndefined();
  });
});
