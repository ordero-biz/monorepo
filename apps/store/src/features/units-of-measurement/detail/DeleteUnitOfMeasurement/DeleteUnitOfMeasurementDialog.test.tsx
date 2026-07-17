import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { clientRoutes } from '@/lib/client/routes';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteUnitOfMeasurementDialog } from './DeleteUnitOfMeasurementDialog';

const routerPushMock = vi.fn();

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  deleteUnitsOfMeasurement: vi.fn(),
}));

const deleteUnitsOfMeasurementMock = vi.mocked(deleteUnitsOfMeasurement);

const { setup } = prepareStoreSetup({
  component: DeleteUnitOfMeasurementDialog,
  props: {
    onOpenChange: vi.fn(),
    open: true,
    unitOfMeasurement: {
      id: 7,
      code: 'KG',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    },
  },
});

describe('DeleteUnitOfMeasurementDialog', () => {
  beforeEach(() => {
    deleteUnitsOfMeasurementMock.mockReset();
    routerPushMock.mockClear();
  });

  it('renders a confirmation dialog with the unit of measurement name', () => {
    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Delete unit of measurement',
    });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete the "Kilogram" unit of measurement?'
    );
  });

  it('deletes the unit, invalidates the list, and navigates to the list page', async () => {
    const user = userEvent.setup();
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteUnitsOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementIds: [7],
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.detail(7),
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: unitsOfMeasurementQueryKeys.list,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.unitsOfMeasurement);
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

    setup();

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

    setup();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Unit of measurement deletion failed',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete unit of measurement' })
    ).toBeVisible();
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
