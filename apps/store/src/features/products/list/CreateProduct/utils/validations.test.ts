import { validateProductCategory, validateProductName } from './validations';

describe('validateProductName', () => {
  it('rejects a whitespace-only product name', () => {
    expect(validateProductName({ value: '   ' })).toBe(
      'Product name is required'
    );
  });

  it('accepts a non-empty product name', () => {
    expect(validateProductName({ value: 'Running Shoes' })).toBeUndefined();
  });
});

describe('validateProductCategory', () => {
  it('requires a category', () => {
    expect(validateProductCategory({ value: null })).toBe(
      'Category is required'
    );
  });

  it('accepts a selected category', () => {
    expect(validateProductCategory({ value: '2' })).toBeUndefined();
  });
});
