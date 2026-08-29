import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import {
  validateAttributeValueName,
  validateAttributeValueStatus,
} from './validations';

describe('attribute value field validation', () => {
  it('requires a non-blank attribute value', () => {
    expect(validateAttributeValueName({ value: '   ' })).toBe(
      'Enter an attribute value or remove this empty field'
    );
  });

  it('accepts valid attribute value inputs', () => {
    expect(validateAttributeValueName({ value: 'Green' })).toBeUndefined();
    expect(
      validateAttributeValueStatus({ value: ATTRIBUTE_VALUE_STATUS.ACTIVE })
    ).toBeUndefined();
  });
});
