import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './fields';

describe('attribute value fields', () => {
  it('creates stable field ids from indexes', () => {
    expect(getAttributeValueFieldId(3)).toBe('attribute-value-3');
  });

  it('creates an empty attribute value field', () => {
    expect(getEmptyAttributeValueField(2)).toEqual({
      id: 'attribute-value-2',
      status: ATTRIBUTE_VALUE_STATUS.DRAFT,
      value: '',
    });
  });
});
