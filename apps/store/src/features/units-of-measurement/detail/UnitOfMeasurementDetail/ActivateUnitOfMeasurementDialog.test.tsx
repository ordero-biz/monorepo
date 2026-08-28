import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateUnitOfMeasurementDialog } from './ActivateUnitOfMeasurementDialog';

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
  component: ActivateUnitOfMeasurementDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
    unitOfMeasurement,
  },
});

describe('ActivateUnitOfMeasurementDialog', () => {
  beforeEach(() => {
    updateUnitOfMeasurementMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('publishes the unit, invalidates caches, and closes on confirm', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        ...unitOfMeasurement,
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(updateUnitOfMeasurementMock).toHaveBeenCalledWith({
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      unitOfMeasurementId: 1,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: unitsOfMeasurementQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.detail(1),
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onUpdatedMock).toHaveBeenCalled();
  });

  it('disables publish and cancel while the request is pending', async () => {
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

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(publishButton);

    expect(publishButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeVisible();

    resolveUpdate?.({
      ok: true,
      data: {
        ...unitOfMeasurement,
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      },
    });

    await screen.findByRole('button', { name: 'Publish' });
  });

  it('shows the mapped error and keeps the dialog open when publishing fails', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.UNIT_OF_MEASUREMENT_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Cannot edit name or status of an active unit of measurement',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Publish unit of measurement' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});
