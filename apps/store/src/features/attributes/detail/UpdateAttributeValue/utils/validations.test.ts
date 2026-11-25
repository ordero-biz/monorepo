import { validateUpdateAttributeValueName } from './validations';

describe('validateUpdateAttributeValueName', () => {
  it('rejects a whitespace-only attribute value name', () => {
    expect(validateUpdateAttributeValueName({ value: '   ' })).toBe(
      'Attribute value name is required'
    );
  });

  it('accepts a non-empty attribute value name', () => {
    expect(validateUpdateAttributeValueName({ value: 'Navy' })).toBeUndefined();
  });
});
