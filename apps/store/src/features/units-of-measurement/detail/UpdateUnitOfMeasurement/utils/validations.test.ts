import { validateUnitOfMeasurementName } from '../../../shared/validations';
import { updateUnitOfMeasurementSchema } from './validations';

describe('update unit of measurement field validation', () => {
  it.each([
    ['name', validateUnitOfMeasurementName, '   ', 'Unit name is required'],
  ])('rejects an invalid unit %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it('trims required and optional values', () => {
    expect(
      updateUnitOfMeasurementSchema.parse({
        name: ' Gram ',
        symbol: ' g ',
        comment: ' Metric weight ',
      })
    ).toEqual({
      name: 'Gram',
      symbol: 'g',
      comment: 'Metric weight',
    });
  });

  it('accepts a blank symbol', () => {
    expect(
      updateUnitOfMeasurementSchema.parse({
        name: 'Gram',
        symbol: '   ',
        comment: '',
      })
    ).toMatchObject({ symbol: '' });
  });

  it('accepts omitted optional fields', () => {
    expect(
      updateUnitOfMeasurementSchema.parse({
        name: 'Gram',
      })
    ).toEqual({ name: 'Gram' });
  });
});
