import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { SupplyEntryFormValues } from '../../../shared/SupplyEditorForm/types';
import { createEmptySupplyEntry } from '../../../shared/SupplyEditorForm/utils';
import {
  SupplyProductsComparison,
  SupplyProductsTable,
} from './SupplyProductsComparison';

const rice: SupplyEntryFormValues = {
  clientId: 'existing-1',
  productVariant: { id: 11, name: 'Rice', sku: 'RICE' },
  unitOfMeasurement: { id: 3, name: 'Bag', symbol: 'bag', status: 'ACTIVE' },
  quantity: '2',
  unitPrice: '5',
  comment: '',
};
const added: SupplyEntryFormValues = {
  ...createEmptySupplyEntry('local-added'),
  productVariant: { id: 13, name: 'Lentils', sku: 'LENTILS' },
  comment: 'Deliver these separately',
};
const saved = { ...rice, clientId: 'existing-20', quantity: '4' };
const { setup } = prepareStoreSetup({
  component: SupplyProductsComparison,
  props: {
    baseline: [rice],
    current: [rice, added],
    latest: [saved],
    merged: [saved, added],
  },
});
const { setup: setupTable } = prepareStoreSetup({
  component: SupplyProductsTable,
  props: { label: 'Saved product list', entries: [rice] },
});

describe('SupplyProductsComparison', () => {
  it('shows the saved rows first and identifies preserved unfinished additions', async () => {
    const user = userEvent.setup();
    setup();
    expect(
      screen.getByText(
        'The latest saved products will appear first. Your 1 row will be kept at the end.'
      )
    ).toBeVisible();
    const table = within(
      screen.getByRole('table', { name: 'Products after applying' })
    );
    const rows = table.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getByText('Rice')).toBeVisible();
    expect(
      within(rows[1]).getByRole('cell', { name: '4 Bag (bag)' })
    ).toBeVisible();
    expect(within(rows[1]).getByText('Saved version')).toBeVisible();
    expect(within(rows[1]).getByText('Different')).toBeVisible();
    expect(within(rows[2]).getByText('Your added row · kept')).toBeVisible();
    expect(within(rows[2]).queryByText('Different')).not.toBeInTheDocument();
    expect(
      within(rows[2]).getByRole('cell', { name: 'Not entered' })
    ).toBeVisible();
    expect(
      within(rows[2]).getByRole('cell', { name: 'Not entered Not selected' })
    ).toBeVisible();
    expect(table.getByText(added.comment)).not.toBeVisible();
    await user.click(table.getByText('Comment', { exact: true }));
    expect(table.getByText(added.comment)).toBeVisible();
    await user.click(
      screen.getByText('Products currently on your page (2 rows)')
    );
    expect(
      within(
        screen.getByRole('table', { name: 'Products currently on your page' })
      ).getByRole('cell', { name: '2 Bag (bag)' })
    ).toBeVisible();
  });

  it('keeps identical saved and unsaved products as separate rows', () => {
    const duplicate = { ...rice, clientId: 'local-duplicate' };
    const firstSaved = { ...rice, clientId: 'existing-20' };
    setup({
      current: [rice, duplicate],
      latest: [firstSaved, { ...rice, clientId: 'existing-21' }],
      merged: [firstSaved, { ...rice, clientId: 'existing-21' }, duplicate],
    });
    const table = within(
      screen.getByRole('table', { name: 'Products after applying' })
    );
    expect(table.getAllByText('Rice')).toHaveLength(3);
    expect(table.getAllByText('Saved version')).toHaveLength(2);
    expect(table.getAllByText('Your added row · kept')).toHaveLength(1);
    const rows = table.getAllByRole('row');
    expect(within(rows[1]).queryByText('Different')).not.toBeInTheDocument();
    expect(within(rows[2]).getByText('Different')).toBeVisible();
    expect(within(rows[3]).queryByText('Different')).not.toBeInTheDocument();
  });

  it('keeps zero prices distinct from missing values and exposes product identifiers', () => {
    setupTable({ entries: [{ ...rice, quantity: '0', unitPrice: '0' }] });
    const table = within(
      screen.getByRole('table', { name: 'Saved product list' })
    );
    expect(table.getByText('RICE')).toBeVisible();
    expect(table.getByRole('cell', { name: '0 Bag (bag)' })).toBeVisible();
    expect(table.getByRole('cell', { name: '$0.00' })).toBeVisible();
    expect(table.queryByText('Not entered')).not.toBeInTheDocument();
  });

  it('shows an empty saved list while keeping the current products available for review', async () => {
    const user = userEvent.setup();
    const empty = createEmptySupplyEntry('initial-placeholder');
    setup({ current: [rice], latest: [empty], merged: [empty] });
    expect(screen.getByText('After applying · 0 rows')).toBeVisible();
    expect(screen.getByText('No products')).toBeVisible();
    expect(
      screen.queryByText(/will be kept at the end/)
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByText('Products currently on your page (1 row)')
    );
    expect(
      within(
        screen.getByRole('table', { name: 'Products currently on your page' })
      ).getByText('Rice')
    ).toBeVisible();
  });
});
