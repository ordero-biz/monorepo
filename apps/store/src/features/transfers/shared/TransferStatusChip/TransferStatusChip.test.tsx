import { screen } from '@testing-library/react';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferStatus } from '@/lib/domain/transfers/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransferStatusChip } from './TransferStatusChip';

const { setup } = prepareStoreSetup({
  component: TransferStatusChip,
  props: {
    status: TRANSFER_STATUS.DRAFT as TransferStatus,
  },
});

describe('TransferStatusChip', () => {
  it.each([
    [TRANSFER_STATUS.DRAFT, 'Draft'],
    [TRANSFER_STATUS.IN_TRANSIT, 'In transit'],
    [TRANSFER_STATUS.COMPLETED, 'Completed'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });
});
