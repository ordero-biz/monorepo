import {
  validateCategoryColor,
  validateCategoryName,
  validateCategoryParentId,
  validateCategorySortOrder,
} from './validations';

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

describe('validateCategoryColor', () => {
  it('rejects an empty color', () => {
    expect(validateCategoryColor({ value: '   ' })).toBe(
      'Category color is required'
    );
  });
});

describe('validateCategorySortOrder', () => {
  it('rejects a non-integer sort order', () => {
    expect(validateCategorySortOrder({ value: '1.5' })).toBe(
      'Sort order must be a whole number'
    );
  });

  it('accepts zero as a sort order', () => {
    expect(validateCategorySortOrder({ value: '0' })).toBeUndefined();
  });
});
