import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { getUnitOfMeasurementDefaultValues } from './fields';

describe('getUnitOfMeasurementDefaultValues', () => {
  it('maps a unit of measurement to editable update form values', () => {
    expect(
      getUnitOfMeasurementDefaultValues({
        id: 1,
        name: 'Kilogram',
        status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
        symbol: 'kg',
        comment: 'Weight unit',
      })
    ).toEqual({
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    });
  });

  it('normalizes absent and nullable optional values to undefined', () => {
    expect(
      getUnitOfMeasurementDefaultValues({
        id: 1,
        name: 'Kilogram',
        status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
        symbol: null,
        comment: null,
      })
    ).toStrictEqual({
      name: 'Kilogram',
      symbol: undefined,
      comment: undefined,
    });
  });
});
