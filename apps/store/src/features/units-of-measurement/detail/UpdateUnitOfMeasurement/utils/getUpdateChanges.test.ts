import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { getUnitOfMeasurementUpdateChanges } from './getUpdateChanges';

const unitOfMeasurement = {
  id: 1,
  name: 'Kilogram',
  status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
  symbol: 'kg',
  comment: 'Weight unit',
};

describe('getUnitOfMeasurementUpdateChanges', () => {
  it('returns only normalized fields that changed', () => {
    expect(
      getUnitOfMeasurementUpdateChanges({
        unitOfMeasurement,
        formValue: {
          name: ' Gram ',
          symbol: ' kg ',
          comment: ' Weight unit ',
        },
      })
    ).toEqual({ name: 'Gram' });
  });

  it('returns no changes when normalized values are unchanged', () => {
    expect(
      getUnitOfMeasurementUpdateChanges({
        unitOfMeasurement,
        formValue: {
          name: ' Kilogram ',
          symbol: ' kg ',
          comment: ' Weight unit ',
        },
      })
    ).toBeUndefined();
  });

  it('represents cleared optional fields as null', () => {
    expect(
      getUnitOfMeasurementUpdateChanges({
        unitOfMeasurement,
        formValue: {
          name: unitOfMeasurement.name,
          symbol: ' ',
          comment: '',
        },
      })
    ).toEqual({ comment: null, symbol: null });
  });

  it('treats absent optional values as unchanged', () => {
    expect(
      getUnitOfMeasurementUpdateChanges({
        unitOfMeasurement: {
          ...unitOfMeasurement,
          symbol: null,
          comment: null,
        },
        formValue: {
          name: unitOfMeasurement.name,
          symbol: undefined,
          comment: undefined,
        },
      })
    ).toBeUndefined();
  });
});
