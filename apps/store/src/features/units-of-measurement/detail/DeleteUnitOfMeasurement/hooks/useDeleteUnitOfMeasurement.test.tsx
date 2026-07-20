import { act, renderHook, waitFor } from '@testing-library/react';
import { deleteUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useDeleteUnitOfMeasurement } from './useDeleteUnitOfMeasurement';

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
  deleteUnitsOfMeasurement: vi.fn(),
}));

const deleteUnitsOfMeasurementMock = vi.mocked(deleteUnitsOfMeasurement);

const setupDeleteUnitOfMeasurementHook = () => {
  const onDeleted = vi.fn();
  const TestQueryProvider = createTestQueryProvider(createTestQueryClient());
  const { result } = renderHook(
    () =>
      useDeleteUnitOfMeasurement({
        onDeleted,
        unitOfMeasurementId: 7,
        unitOfMeasurementName: 'Kilogram',
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

describe('useDeleteUnitOfMeasurement', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteUnitsOfMeasurementMock.mockReset();
  });

  it('deletes the unit of measurement and runs success cleanup', async () => {
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, result } = setupDeleteUnitOfMeasurementHook();

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
      description: 'Unit of measurement Kilogram was deleted.',
      type: 'success',
    });
    expect(result.current.isDeleting).toBe(false);
  });

  it('shows a toast and skips success cleanup when deletion fails', async () => {
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Unit of measurement deletion failed',
      },
    });
    const { onDeleted, result } = setupDeleteUnitOfMeasurementHook();

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
