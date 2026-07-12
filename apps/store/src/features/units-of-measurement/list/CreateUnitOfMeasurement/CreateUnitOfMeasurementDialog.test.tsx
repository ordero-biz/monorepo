import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateUnitOfMeasurementDialog } from './CreateUnitOfMeasurementDialog';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  createUnitOfMeasurement: vi.fn(),
}));

const createUnitOfMeasurementMock = vi.mocked(createUnitOfMeasurement);

const { setup } = prepareStoreSetup({
  component: CreateUnitOfMeasurementDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('CreateUnitOfMeasurementDialog', () => {
  beforeEach(() => {
    createUnitOfMeasurementMock.mockReset();
    onOpenChangeMock.mockClear();
  });

  it('requires code, name, and symbol before add is available', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add unit of measurement',
    });
    const codeField = within(dialog).getByRole('textbox', {
      name: 'Code',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const symbolField = within(dialog).getByRole('textbox', {
      name: 'Symbol',
    });
    const addButton = within(dialog).getByRole('button', { name: 'Add' });

    expect(addButton).toBeDisabled();

    await user.type(codeField, 'KG');
    await user.type(nameField, 'Kilogram');
    expect(addButton).toBeDisabled();

    await user.type(symbolField, '   ');
    await user.tab();

    expect(within(dialog).getByText('Unit symbol is required')).toBeVisible();
    expect(addButton).toBeDisabled();

    await user.clear(symbolField);
    await user.type(symbolField, 'kg');

    expect(addButton).toBeEnabled();
  });

  it('creates a unit of measurement, closes the dialog, and invalidates the list', async () => {
    const user = userEvent.setup();
    createUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        code: 'KG',
        name: 'Kilogram',
        symbol: 'kg',
        comment: 'Weight unit',
      },
    });

    const { onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const dialog = screen.getByRole('dialog', {
      name: 'Add unit of measurement',
    });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Code' }),
      ' KG '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      ' Kilogram '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Symbol' }),
      ' kg '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Comment' }),
      ' Weight unit '
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createUnitOfMeasurementMock).toHaveBeenCalledWith({
      code: 'KG',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: unitsOfMeasurementQueryKeys.list,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    const user = userEvent.setup();
    createUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Unit of measurement creation failed.',
        fieldErrors: {
          code: 'Unit code already exists.',
        },
      },
    });

    const { onOpenChange } = setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add unit of measurement',
    });
    const codeField = within(dialog).getByRole('textbox', {
      name: 'Code',
    });

    await user.type(codeField, 'KG');
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Kilogram'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Symbol' }),
      'kg'
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createUnitOfMeasurementMock).toHaveBeenCalledWith({
      code: 'KG',
      name: 'Kilogram',
      symbol: 'kg',
      comment: '',
    });
    expect(
      await within(dialog).findByText('Unit code already exists.')
    ).toBeVisible();
    expect(codeField).toHaveAccessibleDescription('Unit code already exists.');
    expect(
      await screen.findByRole('dialog', {
        name: 'Unit of measurement creation failed.',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Add unit of measurement' })
    ).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
