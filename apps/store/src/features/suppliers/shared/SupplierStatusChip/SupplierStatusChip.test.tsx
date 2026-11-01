import { screen } from '@testing-library/react';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { SupplierStatus } from '@/lib/domain/suppliers/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierStatusChip } from './SupplierStatusChip';

const { setup } = prepareStoreSetup({
  component: SupplierStatusChip,
  props: {
    status: SUPPLIER_STATUS.DRAFT as SupplierStatus,
  },
});

describe('SupplierStatusChip', () => {
  it.each([
    [SUPPLIER_STATUS.ACTIVE, 'Active'],
    [SUPPLIER_STATUS.DRAFT, 'Draft'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });
});
