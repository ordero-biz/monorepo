import { screen } from '@testing-library/react';
import {
  WAREHOUSE_STATUS,
  type WarehouseStatus,
} from '@/lib/domain/warehouses';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehouseStatusChip } from './WarehouseStatusChip';

const { setup } = prepareStoreSetup({
  component: WarehouseStatusChip,
  props: {
    status: WAREHOUSE_STATUS.DRAFT as WarehouseStatus,
  },
});

describe('WarehouseStatusChip', () => {
  it.each([
    [WAREHOUSE_STATUS.ACTIVE, 'Active'],
    [WAREHOUSE_STATUS.DRAFT, 'Draft'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });

  it('renders nothing when a warehouse has no status', () => {
    setup({ status: undefined });

    expect(screen.queryByText('Active')).not.toBeInTheDocument();
    expect(screen.queryByText('Draft')).not.toBeInTheDocument();
  });
});
