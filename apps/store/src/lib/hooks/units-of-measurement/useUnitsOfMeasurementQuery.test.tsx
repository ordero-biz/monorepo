import { renderHook, waitFor } from '@testing-library/react';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useUnitsOfMeasurementQuery } from './useUnitsOfMeasurementQuery';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  getUnitsOfMeasurement: vi.fn(),
}));

const getUnitsOfMeasurementMock = vi.mocked(getUnitsOfMeasurement);

describe('useUnitsOfMeasurementQuery', () => {
  beforeEach(() => {
    getUnitsOfMeasurementMock.mockReset();
  });

  it('returns paginated units and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 1 };
    const units = {
      content: [
        {
          id: 1,
          status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        },
      ],
      page: { size: 1, number: 1, totalElements: 2, totalPages: 2 },
    };
    getUnitsOfMeasurementMock.mockResolvedValue({ ok: true, data: units });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useUnitsOfMeasurementQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(units);

    rerender();

    expect(getUnitsOfMeasurementMock).toHaveBeenCalledTimes(1);
    expect(getUnitsOfMeasurementMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes a normalized request error without retrying', async () => {
    const error = { status: 500, message: 'Could not load units.' };
    getUnitsOfMeasurementMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useUnitsOfMeasurementQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getUnitsOfMeasurementMock).toHaveBeenCalledTimes(1);
  });
});
