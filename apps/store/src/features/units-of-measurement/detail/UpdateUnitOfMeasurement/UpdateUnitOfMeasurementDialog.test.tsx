import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateUnitOfMeasurementDialog } from './UpdateUnitOfMeasurementDialog';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  updateUnitOfMeasurement: vi.fn(),
}));

const updateUnitOfMeasurementMock = vi.mocked(updateUnitOfMeasurement);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const unitOfMeasurement: UnitOfMeasurement = {
  id: 1,
  name: 'Kilogram',
  status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
  symbol: 'kg',
  comment: 'Weight unit',
};

const { setup } = prepareStoreSetup({
  component: UpdateUnitOfMeasurementDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
    unitOfMeasurement,
  },
});

describe('UpdateUnitOfMeasurementDialog', () => {
  beforeEach(() => {
    updateUnitOfMeasurementMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('opens with the current unit of measurement values', () => {
    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });

    expect(
      within(dialog).queryByRole('radiogroup', { name: 'Unit status' })
    ).not.toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Kilogram'
    );
    expect(within(dialog).getByRole('textbox', { name: 'Symbol' })).toHaveValue(
      'kg'
    );
    expect(
      within(dialog).getByRole('textbox', { name: 'Comment' })
    ).toHaveValue('Weight unit');
  });

  it('treats nullable optional values as empty inputs', () => {
    setup({
      unitOfMeasurement: {
        ...unitOfMeasurement,
        symbol: null,
        comment: null,
      },
    });

    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });

    expect(within(dialog).getByRole('textbox', { name: 'Symbol' })).toHaveValue(
      ''
    );
    expect(
      within(dialog).getByRole('textbox', { name: 'Comment' })
    ).toHaveValue('');
  });

  it('submits updates, closes, invalidates the list, and reports success', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        ...unitOfMeasurement,
        name: 'Gram',
        status: 'DRAFT',
        symbol: 'g',
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });

    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });
    const symbolField = within(dialog).getByRole('textbox', {
      name: 'Symbol',
    });

    await user.clear(nameField);
    await user.type(nameField, ' Gram ');
    await user.clear(symbolField);
    await user.clear(within(dialog).getByRole('textbox', { name: 'Comment' }));
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Comment' }),
      ' Metric weight '
    );
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateUnitOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementId: 1,
      name: 'Gram',
      symbol: null,
      comment: 'Metric weight',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: unitsOfMeasurementQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.detail(1),
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });

  it('closes without a request when no values changed', async () => {
    const user = userEvent.setup();
    const { onOpenChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(updateUnitOfMeasurementMock).not.toHaveBeenCalled();
  });

  it('hides name for an active unit of measurement', () => {
    setup({
      unitOfMeasurement: {
        ...unitOfMeasurement,
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      },
    });

    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });

    expect(
      within(dialog).queryByRole('textbox', { name: 'Name' })
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole('textbox', { name: 'Symbol' })
    ).toBeVisible();
    expect(
      within(dialog).getByRole('textbox', { name: 'Comment' })
    ).toBeVisible();
  });

  it('updates active unit optional fields without submitting a name', async () => {
    const activeUnitOfMeasurement = {
      ...unitOfMeasurement,
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
    };
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        ...activeUnitOfMeasurement,
        symbol: 'kilogram',
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, queryClient } = setup({
      unitOfMeasurement: activeUnitOfMeasurement,
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });
    const symbolField = within(dialog).getByRole('textbox', {
      name: 'Symbol',
    });

    await user.clear(symbolField);
    await user.type(symbolField, 'kilogram');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateUnitOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementId: 1,
      symbol: 'kilogram',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: unitsOfMeasurementQueryKeys.list,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the save CTA enabled and validates name on submit', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    expect(saveButton).toBeEnabled();

    await user.clear(nameField);

    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(
      await within(dialog).findByText('Unit name is required')
    ).toBeVisible();
    expect(saveButton).toBeEnabled();
    expect(updateUnitOfMeasurementMock).not.toHaveBeenCalled();
  });

  it('prevents another save while the update is in flight', async () => {
    let resolveUpdate:
      | ((value: Awaited<ReturnType<typeof updateUnitOfMeasurement>>) => void)
      | undefined;

    updateUnitOfMeasurementMock.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });
    const symbolField = within(dialog).getByRole('textbox', {
      name: 'Symbol',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    await user.clear(symbolField);
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeVisible();

    resolveUpdate?.({
      ok: true,
      data: unitOfMeasurement,
    });

    await screen.findByRole('button', { name: 'Save' });
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Unit of measurement update failed.',
        fieldErrors: {
          name: 'Unit name already exists.',
        },
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated } = setup();
    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Gram');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findByText('Unit name already exists.')
    ).toBeVisible();
    expect(nameField).toHaveAccessibleDescription('Unit name already exists.');
    expect(
      await screen.findByRole('dialog', {
        name: 'Unit of measurement update failed.',
      })
    ).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
