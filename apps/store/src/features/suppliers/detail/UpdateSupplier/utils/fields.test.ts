import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { Supplier } from '@/lib/domain/suppliers/types';
import { getSupplierDefaultValues } from './fields';

describe('getSupplierDefaultValues', () => {
  it('maps a supplier to editable update form values', () => {
    const mockSupplier: Supplier = {
      id: 1,
      name: 'Acme Corp',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'contact@acme.com',
      phone: '123-456-7890',
      address: '123 Acme St',
      comment: 'VIP supplier',
    };

    const result = getSupplierDefaultValues(mockSupplier);

    expect(result).toEqual({
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '123-456-7890',
      address: '123 Acme St',
      comment: 'VIP supplier',
    });

    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('status');
  });

  it('normalizes absent optional field values to undefined', () => {
    const result = getSupplierDefaultValues({
      id: 1,
      name: 'Acme Corp',
      status: SUPPLIER_STATUS.DRAFT,
    } as Supplier);

    expect(result).toStrictEqual({
      name: 'Acme Corp',
      email: undefined,
      phone: undefined,
      address: undefined,
      comment: undefined,
    });
  });

  it('normalizes nullable optional field values to undefined', () => {
    const result = getSupplierDefaultValues({
      id: 1,
      name: 'Acme Corp',
      status: SUPPLIER_STATUS.DRAFT,
      email: null,
      phone: null,
      address: null,
      comment: null,
    });

    expect(result).toStrictEqual({
      name: 'Acme Corp',
      email: undefined,
      phone: undefined,
      address: undefined,
      comment: undefined,
    });
  });
});
