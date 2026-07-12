import {
  createUnitOfMeasurementSchema,
  validateUnitOfMeasurementCode,
  validateUnitOfMeasurementName,
  validateUnitOfMeasurementSymbol,
} from './validations';

describe('unit of measurement field validation', () => {
  it.each([
    ['code', validateUnitOfMeasurementCode, '   ', 'Unit code is required'],
    ['name', validateUnitOfMeasurementName, '   ', 'Unit name is required'],
    [
      'symbol',
      validateUnitOfMeasurementSymbol,
      '   ',
      'Unit symbol is required',
    ],
  ])('rejects an invalid unit %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it.each([
    ['code', validateUnitOfMeasurementCode, 'KG'],
    ['name', validateUnitOfMeasurementName, 'Kilogram'],
    ['symbol', validateUnitOfMeasurementSymbol, 'kg'],
  ])('accepts a valid unit %s', (_, validate, value) => {
    expect(validate({ value })).toBeUndefined();
  });

  it('trims required values while retaining the optional comment', () => {
    expect(
      createUnitOfMeasurementSchema.parse({
        code: ' KG ',
        name: ' Kilogram ',
        symbol: ' kg ',
        comment: ' Weight unit ',
      })
    ).toEqual({
      code: 'KG',
      name: 'Kilogram',
      symbol: 'kg',
      comment: ' Weight unit ',
    });
  });
});
