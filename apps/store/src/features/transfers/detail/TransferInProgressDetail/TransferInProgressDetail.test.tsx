import { screen, within } from '@testing-library/react';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransferInProgressDetail } from './TransferInProgressDetail';

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
  status: TRANSFER_STATUS.IN_TRANSIT,
  comment: 'Fragile items on top',
  dispatchedAt: '2026-10-30T09:00:00Z',
  dispatchedBy: 'owner@example.test',
  completedAt: null,
  completedBy: null,
  createdAt: '2026-10-29T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-10-30T09:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [
    {
      id: 17,
      productVariant: {
        id: 11,
        name: 'Jasmine Rice 5kg',
        sku: 'GR-1042',
        barcode: '',
      },
      unitOfMeasurement: {
        id: 4,
        name: 'Bag',
        symbol: 'bag',
        status: 'ACTIVE',
        comment: null,
      },
      quantity: 1200,
      comment: 'Keep dry',
    },
    {
      id: 18,
      productVariant: { id: 12, name: 'Rice sample', sku: '', barcode: '' },
      unitOfMeasurement: {
        id: 5,
        name: 'Box',
        symbol: null,
        status: 'ACTIVE',
        comment: null,
      },
      quantity: 2,
      comment: null,
    },
  ],
  version: 2,
};

const { setup } = prepareStoreSetup({
  component: TransferInProgressDetail,
  props: { transfer },
});

describe('TransferInProgressDetail', () => {
  it('displays the transfer information and every entry without editing controls', () => {
    setup();

    expect(screen.getByRole('note')).toHaveTextContent(
      'In transit. Stock has been deducted from Main Warehouse and is locked until received at East Warehouse. Transfer details are read-only while in transit.'
    );
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual(
      ['From warehouse', 'To warehouse', 'Sent', 'Comment']
    );
    expect(
      screen.getAllByRole('definition').map((item) => item.textContent)
    ).toEqual([
      'Main Warehouse',
      'East Warehouse',
      '30 Oct 2026 · owner@example.test',
      'Fragile items on top',
    ]);

    const table = screen.getByRole('table', { name: 'Transfer entries' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    const rice = within(table).getByRole('row', { name: /Jasmine Rice 5kg/ });
    expect(within(rice).getAllByRole('cell')[0]).toHaveTextContent(
      /^Jasmine Rice 5kgGR-1042$/
    );
    expect(within(rice).getByText('Bag (bag)')).toBeVisible();
    expect(within(rice).getByText('1,200')).toBeVisible();
    expect(within(rice).getByText('Keep dry')).toBeVisible();
    const sample = within(table).getByRole('row', { name: /Rice sample/ });
    expect(within(sample).getByText('Box')).toBeVisible();
    expect(within(sample).getByText('2')).toBeVisible();
    expect(within(sample).getByText('-')).toBeVisible();
    expect(
      within(table).getByRole('row', { name: 'Total 1,202' })
    ).toBeVisible();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Save draft|Transfer/ })
    ).not.toBeInTheDocument();
  });

  it('displays empty entries and nullable values', () => {
    setup({
      transfer: {
        ...transfer,
        comment: null,
        dispatchedAt: null,
        dispatchedBy: null,
        transferEntries: [],
      },
    });

    expect(screen.getByText('No products in this transfer.')).toBeVisible();
    expect(screen.getAllByText('-')).toHaveLength(2);
    expect(screen.getByRole('row', { name: 'Total 0' })).toBeVisible();
  });

  it('shows the sent date alone when the sender is unknown', () => {
    setup({ transfer: { ...transfer, dispatchedBy: null } });

    expect(screen.getByText('30 Oct 2026')).toBeVisible();
  });
});
