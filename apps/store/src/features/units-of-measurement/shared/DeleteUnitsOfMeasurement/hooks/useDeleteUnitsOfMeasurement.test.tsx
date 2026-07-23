import { act, renderHook, waitFor } from '@testing-library/react';
import { deleteUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useDeleteUnitsOfMeasurement } from './useDeleteUnitsOfMeasurement';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@/ui/index')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  deleteUnitsOfMeasurement: vi.fn(),
}));

const deleteUnitsOfMeasurementMock = vi.mocked(deleteUnitsOfMeasurement);

const setupDeleteUnitsOfMeasurementHook = (unitOfMeasurementIds = [7]) => {
  const onDeleted = vi.fn();
  const TestQueryProvider = createTestQueryProvider(createTestQueryClient());
  const { result } = renderHook(
    () =>
      useDeleteUnitsOfMeasurement({
        onDeleted,
        unitOfMeasurementIds,
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    onDeleted,
    result,
  };
};

describe('useDeleteUnitsOfMeasurement', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteUnitsOfMeasurementMock.mockReset();
  });

  it('deletes a unit of measurement and runs success cleanup', async () => {
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, result } = setupDeleteUnitsOfMeasurementHook();

    expect(result.current.isDeleting).toBe(false);

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(deleteUnitsOfMeasurementMock).toHaveBeenCalledWith({
        unitOfMeasurementIds: [7],
      })
    );
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Unit of measurement was deleted.',
      type: 'success',
    });
    expect(result.current.isDeleting).toBe(false);
  });

  it('uses plural success copy for multiple deleted units', async () => {
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { result } = setupDeleteUnitsOfMeasurementHook([7, 8]);

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: '2 units of measurement were deleted.',
        type: 'success',
      })
    );
  });

  it('shows a toast and skips success cleanup when deletion fails', async () => {
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Unit of measurement deletion failed',
      },
    });
    const { onDeleted, result } = setupDeleteUnitsOfMeasurementHook();

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Unit of measurement deletion failed',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
