import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import {
  validateAttributeName,
  validateAttributeStatus,
  validateAttributeValueStatus,
} from './validations';

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

describe('attribute status validation', () => {
  it('accepts the supported attribute statuses', () => {
    expect(
      validateAttributeStatus({ value: ATTRIBUTE_STATUS.DRAFT })
    ).toBeUndefined();
    expect(
      validateAttributeValueStatus({ value: ATTRIBUTE_STATUS.ACTIVE })
    ).toBeUndefined();
  });

  it('rejects unsupported attribute statuses', () => {
    expect(validateAttributeStatus({ value: 'ARCHIVED' as never })).toBe(
      'Attribute status must be Draft or Active'
    );
    expect(validateAttributeValueStatus({ value: 'ARCHIVED' as never })).toBe(
      'Attribute value status must be Draft or Active'
    );
  });
});
