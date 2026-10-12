import { screen } from '@testing-library/react';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyStatus } from '@/lib/domain/supplies/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplyStatusChip } from './SupplyStatusChip';

const { setup } = prepareStoreSetup({
  component: SupplyStatusChip,
  props: {
    status: SUPPLY_STATUS.DRAFT as SupplyStatus,
  },
});

describe('SupplyStatusChip', () => {
  it.each([
    [SUPPLY_STATUS.DRAFT, 'Draft'],
    [SUPPLY_STATUS.COMPLETED, 'Completed'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });
});
