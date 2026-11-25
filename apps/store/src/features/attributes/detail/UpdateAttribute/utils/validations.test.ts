import { validateUpdateAttributeName } from './validations';

describe('validateUpdateAttributeName', () => {
  it('rejects a whitespace-only attribute name', () => {
    expect(validateUpdateAttributeName({ value: '   ' })).toBe(
      'Attribute name is required'
    );
  });

  it('accepts a non-empty attribute name', () => {
    expect(validateUpdateAttributeName({ value: 'Material' })).toBeUndefined();
  });
});
