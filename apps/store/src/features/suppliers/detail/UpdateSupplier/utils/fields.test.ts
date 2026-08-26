import type { Supplier } from '@/lib/domain/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { getSupplierDefaultValues } from './fields';

describe('getSupplierDefaultValues', () => {
  it('should correctly map a Supplier to SupplierEntityFormValues by picking specific fields', () => {
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
      status: SUPPLIER_STATUS.DRAFT,
      email: 'contact@acme.com',
      phone: '123-456-7890',
      address: '123 Acme St',
      comment: 'VIP supplier',
    });

    expect(result).not.toHaveProperty('id');
  });
});
