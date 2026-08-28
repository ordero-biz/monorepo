import { act, renderHook, waitFor } from '@testing-library/react';
import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useActivateUnitOfMeasurement } from './useActivateUnitOfMeasurement';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  updateUnitOfMeasurement: vi.fn(),
}));

const updateUnitOfMeasurementMock = vi.mocked(updateUnitOfMeasurement);

const setupActivateUnitOfMeasurementHook = () => {
  const onActivated = vi.fn();
  const queryClient = createTestQueryClient();
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const TestQueryProvider = createTestQueryProvider(queryClient);
  const { result } = renderHook(
    () =>
      useActivateUnitOfMeasurement({
        onActivated,
        unitOfMeasurementId: 1,
        unitOfMeasurementName: 'Kilogram',
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    invalidateQueriesSpy,
    onActivated,
    result,
  };
};

describe('useActivateUnitOfMeasurement', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    updateUnitOfMeasurementMock.mockReset();
  });

  it('publishes the unit, invalidates queries, and reports success', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Kilogram',
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
        symbol: 'kg',
        comment: 'Weight unit',
      },
    });
    const { invalidateQueriesSpy, onActivated, result } =
      setupActivateUnitOfMeasurementHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(updateUnitOfMeasurementMock).toHaveBeenCalledWith({
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
        unitOfMeasurementId: 1,
      })
    );
    await waitFor(() => expect(onActivated).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.list,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: unitsOfMeasurementQueryKeys.detail(1),
    });
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Unit of measurement Kilogram was published',
      type: 'success',
    });
  });

  it('shows the mapped error and skips success effects when publishing fails', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.UNIT_OF_MEASUREMENT_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const { onActivated, result } = setupActivateUnitOfMeasurementHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description:
          'Cannot edit name or status of an active unit of measurement',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
    expect(result.current.isActivating).toBe(false);
  });
});
