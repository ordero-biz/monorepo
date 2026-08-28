import { validateUnitOfMeasurementName } from '../../../shared/validations';
import { createUnitOfMeasurementSchema } from './validations';

describe('unit of measurement field validation', () => {
  it.each([
    ['name', validateUnitOfMeasurementName, '   ', 'Unit name is required'],
  ])('rejects an invalid unit %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it.each([
    ['name', validateUnitOfMeasurementName, 'Kilogram'],
  ])('accepts a valid unit %s', (_, validate, value) => {
    expect(validate({ value })).toBeUndefined();
  });

  it('trims required and optional values', () => {
    expect(
      createUnitOfMeasurementSchema.parse({
        status: 'ACTIVE',
        name: ' Kilogram ',
        symbol: ' kg ',
        comment: ' Weight unit ',
      })
    ).toEqual({
      status: 'ACTIVE',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    });
  });

  it('allows optional values to be omitted', () => {
    expect(
      createUnitOfMeasurementSchema.parse({
        status: 'ACTIVE',
        name: 'Kilogram',
      })
    ).toEqual({
      status: 'ACTIVE',
      name: 'Kilogram',
    });
  });
});
