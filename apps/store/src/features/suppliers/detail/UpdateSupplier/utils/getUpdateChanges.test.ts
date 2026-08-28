import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { Supplier } from '@/lib/domain/suppliers/types';
import { getSupplierUpdateChanges } from './getUpdateChanges';

const supplier: Supplier = {
  id: 1,
  name: 'Fresh Farms',
  status: SUPPLIER_STATUS.DRAFT,
  email: 'orders@fresh.example',
  phone: '+1 555 0100',
  address: '123 Market St',
  comment: 'Preferred produce supplier',
};

describe('getSupplierUpdateChanges', () => {
  it('returns only normalized fields that changed', () => {
    expect(
      getSupplierUpdateChanges({
        supplier,
        formValue: {
          name: ' Fresh Farms Updated ',
          email: ' orders@fresh.example ',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        },
      })
    ).toEqual({ name: 'Fresh Farms Updated' });
  });

  it('returns no changes when normalized values are unchanged', () => {
    expect(
      getSupplierUpdateChanges({
        supplier,
        formValue: {
          name: ' Fresh Farms ',
          email: ' orders@fresh.example ',
          phone: ' +1 555 0100 ',
          address: ' 123 Market St ',
          comment: ' Preferred produce supplier ',
        },
      })
    ).toBeUndefined();
  });

  it('returns active supplier name changes for backend validation', () => {
    expect(
      getSupplierUpdateChanges({
        supplier: {
          ...supplier,
          status: SUPPLIER_STATUS.ACTIVE,
        },
        formValue: {
          name: 'Renamed Fresh Farms',
          email: 'updated@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        },
      })
    ).toEqual({
      name: 'Renamed Fresh Farms',
      email: 'updated@fresh.example',
    });
  });

  it('detects an optional contact field being cleared', () => {
    expect(
      getSupplierUpdateChanges({
        supplier,
        formValue: {
          name: 'Fresh Farms',
          email: '',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        },
      })
    ).toEqual({ email: '' });
  });
});
