import {
  addStoreSchema,
  validateStoreName,
  validateStoreSubDomain,
} from './validations';

describe('add-store validation', () => {
  it('accepts trimmed store values', () => {
    expect(validateStoreName({ value: 'North Shop' })).toBeUndefined();
    expect(validateStoreSubDomain({ value: 'north-shop' })).toBeUndefined();
    expect(
      addStoreSchema.parse({
        name: ' North Shop ',
        subDomain: ' north-shop ',
      })
    ).toStrictEqual({
      name: 'North Shop',
      subDomain: 'north-shop',
    });
  });

  it('requires a store name and subdomain', () => {
    expect(validateStoreName({ value: ' ' })).toBe('This field is required.');
    expect(validateStoreSubDomain({ value: ' ' })).toBe(
      'This field is required.'
    );
  });
});
