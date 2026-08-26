import { screen } from '@testing-library/react';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierDetailInfo } from './SupplierDetailInfo';

const { setup } = prepareStoreSetup({
  component: SupplierDetailInfo,
  props: {
    supplier: {
      id: 1,
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    },
  },
});

describe('SupplierDetailInfo', () => {
  it('renders the supplier contact details', () => {
    setup();

    expect(screen.getByText('Supplier details')).toBeVisible();
    expect(screen.getByText('Email')).toBeVisible();
    expect(screen.getByText('orders@fresh.example')).toBeVisible();
    expect(screen.getByText('Phone')).toBeVisible();
    expect(screen.getByText('+1 555 0100')).toBeVisible();
    expect(screen.getByText('Address')).toBeVisible();
    expect(screen.getByText('123 Market St')).toBeVisible();
    expect(screen.getByText('Comment')).toBeVisible();
    expect(screen.getByText('Preferred produce supplier')).toBeVisible();
  });

  it('renders a placeholder when optional text is not provided', () => {
    const { supplier } = setup({
      supplier: {
        id: 1,
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: '',
      },
    });

    expect(screen.getByText(supplier.comment || '-')).toBeVisible();
  });
});
