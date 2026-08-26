import {
  updateUnitOfMeasurementSchema,
  validateUpdateUnitOfMeasurementName,
  validateUpdateUnitOfMeasurementSymbol,
} from './validations';

describe('update unit of measurement field validation', () => {
  it.each([
    [
      'name',
      validateUpdateUnitOfMeasurementName,
      '   ',
      'Unit name is required',
    ],
    [
      'symbol',
      validateUpdateUnitOfMeasurementSymbol,
      '   ',
      'Unit symbol is required',
    ],
  ])('rejects an invalid unit %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it('trims required values while retaining the optional comment', () => {
    expect(
      updateUnitOfMeasurementSchema.parse({
        status: 'DRAFT',
        name: ' Gram ',
        symbol: ' g ',
        comment: ' Metric weight ',
      })
    ).toEqual({
      status: 'DRAFT',
      name: 'Gram',
      symbol: 'g',
      comment: ' Metric weight ',
    });
  });
});
