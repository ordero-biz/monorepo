import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateUnitOfMeasurementDialogTrigger } from './UpdateUnitOfMeasurementDialogTrigger';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  updateUnitOfMeasurement: vi.fn(),
}));

const updateUnitOfMeasurementMock = vi.mocked(updateUnitOfMeasurement);

const { setup } = prepareStoreSetup({
  component: UpdateUnitOfMeasurementDialogTrigger,
  props: {
    onUpdated: vi.fn(),
    unitOfMeasurement: {
      id: 1,
      status: 'DRAFT',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    },
  },
});

describe('UpdateUnitOfMeasurementDialogTrigger', () => {
  beforeEach(() => {
    updateUnitOfMeasurementMock.mockReset();
  });

  it('opens the update unit of measurement dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Kilogram' }));

    expect(
      screen.getByRole('dialog', { name: 'Edit unit of measurement' })
    ).toBeVisible();
  });

  it('resets unsaved values when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Kilogram' }));

    const nameField = screen.getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Gram');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Edit unit of measurement' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Kilogram' }));

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Kilogram'
    );
  });

  it('uses the saved values when the dialog is reopened after an update', async () => {
    const updatedUnitOfMeasurement = {
      id: 1,
      status: 'DRAFT' as const,
      name: 'Gram',
      symbol: 'g',
      comment: 'Metric weight',
    };
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: updatedUnitOfMeasurement,
    });
    const user = userEvent.setup();

    const { renderResult } = setup();

    await user.click(screen.getByRole('button', { name: 'Edit Kilogram' }));

    const nameField = screen.getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, ' Gram ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Unit of measurement Gram was updated')
    ).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit unit of measurement' })
    ).not.toBeInTheDocument();

    renderResult.rerender({ unitOfMeasurement: updatedUnitOfMeasurement });

    await user.click(screen.getByRole('button', { name: 'Edit Gram' }));

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Gram');
    expect(screen.getByRole('textbox', { name: 'Symbol' })).toHaveValue('g');
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Metric weight'
    );
  });
});
