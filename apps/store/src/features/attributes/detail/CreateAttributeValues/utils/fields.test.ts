import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './fields';

describe('attribute value field factories', () => {
  it('creates a stable field id from its index', () => {
    expect(getAttributeValueFieldId(2)).toBe('attribute-value-2');
  });

  it('creates a draft empty attribute-value form field', () => {
    expect(getEmptyAttributeValueField(2)).toEqual({
      id: 'attribute-value-2',
      status: ATTRIBUTE_VALUE_STATUS.DRAFT,
      value: '',
    });
  });
});
