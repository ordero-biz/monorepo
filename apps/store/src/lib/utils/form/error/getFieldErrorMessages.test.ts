import { getFieldErrorMessages } from './getFieldErrorMessages';

describe('getFieldErrorMessages', () => {
  it('returns an empty object when there are no field errors', () => {
    expect(getFieldErrorMessages({})).toEqual({});
  });

  it('normalizes messages and preserves nested field paths', () => {
    expect(
      getFieldErrorMessages({
        name: { errors: ['Product name is required'] },
        'productVariants[0].sku': {
          errors: [{ message: 'SKU already exists' }],
        },
        'productVariants[1].barcode': {
          errors: [new Error('Barcode already exists')],
        },
      })
    ).toEqual({
      name: 'Product name is required',
      'productVariants[0].sku': 'SKU already exists',
      'productVariants[1].barcode': 'Barcode already exists',
    });
  });

  it('uses the first stored error without reordering by validation source', () => {
    const fields = {
      name: {
        errors: ['Client error', 'Service error'],
        errorMap: { onChange: 'Client error', onSubmit: 'Service error' },
      },
    };
    expect(getFieldErrorMessages(fields)).toEqual({ name: 'Client error' });
  });

  it('uses the shared fallback when the first error has no readable message', () => {
    expect(
      getFieldErrorMessages({ name: { errors: [{ message: 42 }] } })
    ).toEqual({ name: 'This field needs attention.' });
  });
});
