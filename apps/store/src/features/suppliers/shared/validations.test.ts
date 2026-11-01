import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import {
  validateSupplierEmail,
  validateSupplierName,
  validateSupplierStatus,
} from './validations';

describe('supplier field validation', () => {
  it.each([
    ['name', validateSupplierName, '   ', 'Supplier name is required'],
    [
      'email',
      validateSupplierEmail,
      'not-an-email',
      'Enter a valid supplier email',
    ],
  ])('rejects an invalid supplier %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it.each([
    ['name', validateSupplierName, 'Fresh Farms'],
    ['email', validateSupplierEmail, ''],
    ['email', validateSupplierEmail, 'orders@fresh.example'],
  ])('accepts a valid supplier %s', (_, validate, value) => {
    expect(validate({ value })).toBeUndefined();
  });

  it('accepts an omitted supplier email', () => {
    expect(validateSupplierEmail({ value: undefined })).toBeUndefined();
  });

  it('accepts a valid supplier status', () => {
    expect(
      validateSupplierStatus({ value: SUPPLIER_STATUS.DRAFT })
    ).toBeUndefined();
  });
});
