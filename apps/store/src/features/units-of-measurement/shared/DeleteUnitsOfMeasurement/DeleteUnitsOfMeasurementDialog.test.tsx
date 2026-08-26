import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteUnitsOfMeasurementDialog } from './DeleteUnitsOfMeasurementDialog';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  deleteUnitsOfMeasurement: vi.fn(),
}));

const deleteUnitsOfMeasurementMock = vi.mocked(deleteUnitsOfMeasurement);

const singleUnit = {
  id: 7,
  status: 'ACTIVE' as const,
  name: 'Kilogram',
  symbol: 'kg',
  comment: 'Weight unit',
};

const multipleUnits = [
  singleUnit,
  {
    id: 8,
    status: 'DRAFT' as const,
    name: 'Gram',
    symbol: 'g',
    comment: 'Weight unit',
  },
];

const { setup: setupSingle } = prepareStoreSetup({
  component: DeleteUnitsOfMeasurementDialog,
  props: {
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
    unitsOfMeasurement: [singleUnit],
  },
});

const { setup: setupMultiple } = prepareStoreSetup({
  component: DeleteUnitsOfMeasurementDialog,
  props: {
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
    unitsOfMeasurement: multipleUnits,
  },
});

describe('DeleteUnitsOfMeasurementDialog', () => {
  beforeEach(() => {
    deleteUnitsOfMeasurementMock.mockReset();
  });

  it('renders a confirmation dialog with the unit of measurement name when single unit', () => {
    setupSingle();

    const dialog = screen.getByRole('dialog', {
      name: 'Delete unit of measurement',
    });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete the "Kilogram" unit of measurement?'
    );
  });

  it('renders a confirmation dialog with the count of units when multiple units', () => {
    setupMultiple();

    const dialog = screen.getByRole('dialog', {
      name: 'Delete units of measurement',
    });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete 2 units of measurement?'
    );
  });

  it('deletes the units, invalidates the list, and closes the dialog', async () => {
    const user = userEvent.setup();
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, onOpenChange, queryClient } = setupMultiple();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteUnitsOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementIds: [7, 8],
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.detail(7),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.detail(8),
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: unitsOfMeasurementQueryKeys.list,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onDeleted).toHaveBeenCalled();
  });

  it('prevents another deletion while the request is in flight', async () => {
    let resolveDelete:
      | ((value: Awaited<ReturnType<typeof deleteUnitsOfMeasurement>>) => void)
      | undefined;

    deleteUnitsOfMeasurementMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      })
    );
    const user = userEvent.setup();

    setupSingle();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeVisible();

    resolveDelete?.({
      ok: true,
      data: undefined,
    });

    await screen.findByRole('button', { name: 'Delete' });
  });

  it('shows a toast and stays on the page when deletion fails', async () => {
    const user = userEvent.setup();
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Unit of measurement deletion failed',
      },
    });

    setupSingle();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Unit of measurement deletion failed',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete unit of measurement' })
    ).toBeVisible();
  });
});
