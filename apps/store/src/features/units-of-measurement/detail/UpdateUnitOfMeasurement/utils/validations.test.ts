import {
  updateUnitOfMeasurementSchema,
  validateUpdateUnitOfMeasurementCode,
  validateUpdateUnitOfMeasurementName,
  validateUpdateUnitOfMeasurementSymbol,
} from './validations';

describe('update unit of measurement field validation', () => {
  it.each([
    [
      'code',
      validateUpdateUnitOfMeasurementCode,
      '   ',
      'Unit code is required',
    ],
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
        code: ' G ',
        name: ' Gram ',
        symbol: ' g ',
        comment: ' Metric weight ',
      })
    ).toEqual({
      code: 'G',
      name: 'Gram',
      symbol: 'g',
      comment: ' Metric weight ',
    });
  });
});
