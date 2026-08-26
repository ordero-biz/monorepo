import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import {
  supplierEntitySchema,
  validateSupplierAddress,
  validateSupplierEmail,
  validateSupplierName,
  validateSupplierPhone,
} from './validations';

describe('supplier field validation', () => {
  it.each([
    ['name', validateSupplierName, '   ', 'Supplier name is required'],
    ['email', validateSupplierEmail, '   ', 'Supplier email is required'],
    [
      'email',
      validateSupplierEmail,
      'not-an-email',
      'Enter a valid supplier email',
    ],
    ['phone', validateSupplierPhone, '   ', 'Supplier phone is required'],
    ['address', validateSupplierAddress, '   ', 'Supplier address is required'],
  ])('rejects an invalid supplier %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it.each([
    ['name', validateSupplierName, 'Fresh Farms'],
    ['email', validateSupplierEmail, 'orders@fresh.example'],
    ['phone', validateSupplierPhone, '+1 555 0100'],
    ['address', validateSupplierAddress, '123 Market St'],
  ])('accepts a valid supplier %s', (_, validate, value) => {
    expect(validate({ value })).toBeUndefined();
  });

  it('trims required values while retaining the optional comment', () => {
    expect(
      supplierEntitySchema.parse({
        name: ' Fresh Farms ',
        status: SUPPLIER_STATUS.DRAFT,
        email: ' orders@fresh.example ',
        phone: ' +1 555 0100 ',
        address: ' 123 Market St ',
        comment: ' Preferred produce supplier ',
      })
    ).toEqual({
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: ' Preferred produce supplier ',
    });
  });
});
