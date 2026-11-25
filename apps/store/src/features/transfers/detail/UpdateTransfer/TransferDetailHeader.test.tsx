import { screen, within } from '@testing-library/react';
import { clientRoutes } from '@/lib/client/routes';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransferDetailHeader } from './TransferDetailHeader';
import type { TransferDetailHeaderProps } from './types';

const transfer: TransferDetails = {
  id: 5,
  sourceWarehouse: {
    id: 1,
    name: 'Main Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  destinationWarehouse: {
    id: 2,
    name: 'East Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  transferNumber: 'Weekend restock',
  status: TRANSFER_STATUS.DRAFT,
  comment: null,
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-11-17T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-11-17T10:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [],
  version: 1,
};

const { setup } = prepareStoreSetup<TransferDetailHeaderProps>({
  component: TransferDetailHeader,
  props: {
    transfer,
  },
});

describe('TransferDetailHeader', () => {
  it('shows the title, status and breadcrumb', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Weekend restock' })
    ).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(
      within(breadcrumbs).getByRole('link', { name: 'Transfers' })
    ).toHaveAttribute('href', clientRoutes.transfers);
    expect(within(breadcrumbs).getByText('Weekend restock')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('falls back to a generic title when the transfer has no number', () => {
    setup({ transfer: { ...transfer, transferNumber: '' } });

    expect(screen.getByRole('heading', { name: 'Transfer' })).toBeVisible();
  });
});
