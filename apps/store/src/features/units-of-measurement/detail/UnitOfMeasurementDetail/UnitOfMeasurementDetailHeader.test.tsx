import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitOfMeasurementDetailHeader } from './UnitOfMeasurementDetailHeader';

vi.mock('../UpdateUnitOfMeasurement/UpdateUnitOfMeasurementDialog', () => ({
  UpdateUnitOfMeasurementDialog: ({
    onUpdated,
    open,
  }: {
    onUpdated: () => Promise<void> | void;
    open: boolean;
  }) =>
    open ? (
      <button onClick={() => void onUpdated()} type="button">
        Save unit of measurement
      </button>
    ) : null,
}));

const { setup } = prepareStoreSetup({
  component: UnitOfMeasurementDetailHeader,
  props: {
    onDeleted: vi.fn(),
    onUpdated: vi.fn(),
    unitOfMeasurement: {
      id: 1,
      name: 'Kilogram',
      status: 'DRAFT' as 'ACTIVE' | 'DRAFT',
      symbol: 'kg',
      comment: 'Weight unit',
    },
  },
});

describe('UnitOfMeasurementDetailHeader', () => {
  it('opens the edit action from the actions menu', async () => {
    const user = userEvent.setup();
    const { onUpdated } = setup();

    expect(screen.getByRole('heading', { name: 'Kilogram' })).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Kilogram' })
    );
    await user.click(
      await screen.findByRole('menuitem', {
        name: 'Edit unit of measurement',
      })
    );
    await user.click(
      screen.getByRole('button', { name: 'Save unit of measurement' })
    );

    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });

  it('opens a confirmation dialog before publishing a draft unit of measurement', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish unit of measurement' })
    ).toBeVisible();
    expect(
      screen.getByText(
        'This action cannot be undone. However, you will still be able to update the symbol and comment.'
      )
    ).toBeVisible();
  });

  it('shows edit actions but not Publish for an active unit of measurement', async () => {
    const user = userEvent.setup();

    setup({
      unitOfMeasurement: {
        id: 1,
        name: 'Kilogram',
        status: 'ACTIVE',
        symbol: 'kg',
        comment: 'Weight unit',
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Kilogram' })
    );

    expect(
      await screen.findByRole('menuitem', {
        name: 'Edit unit of measurement',
      })
    ).toBeVisible();
  });
});
