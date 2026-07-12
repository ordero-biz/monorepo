import { validateAttributeName } from './validations';

describe('validateAttributeName', () => {
  it('rejects a whitespace-only attribute name', () => {
    expect(validateAttributeName({ value: '   ' })).toBe(
      'Attribute name is required'
    );
  });

  it('accepts a non-empty attribute name', () => {
    expect(validateAttributeName({ value: 'Material' })).toBeUndefined();
  });
});
