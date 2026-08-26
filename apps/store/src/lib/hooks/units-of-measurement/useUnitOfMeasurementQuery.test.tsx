import { renderHook, waitFor } from '@testing-library/react';
import { getUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useUnitOfMeasurementQuery } from './useUnitOfMeasurementQuery';

vi.mock('@/lib/client/api/units-of-measurement', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement');

  return {
    ...actual,
    getUnitOfMeasurement: vi.fn(),
  };
});

const getUnitOfMeasurementMock = vi.mocked(getUnitOfMeasurement);

const unitOfMeasurement = {
  id: 1,
  status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
  name: 'Kilogram',
  symbol: 'kg',
  comment: 'Weight unit',
};

describe('unit of measurement query', () => {
  beforeEach(() => {
    getUnitOfMeasurementMock.mockReset();
  });

  it('returns unit of measurement details by id', async () => {
    getUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useUnitOfMeasurementQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(unitOfMeasurement);
    expect(getUnitOfMeasurementMock).toHaveBeenCalledWith('1');
  });

  it('reads hydrated unit of measurement details without a client request', async () => {
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    queryClient.setQueryData(
      unitsOfMeasurementQueryKeys.detail('1'),
      unitOfMeasurement
    );

    const { result } = renderHook(() => useUnitOfMeasurementQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(unitOfMeasurement);
    expect(getUnitOfMeasurementMock).not.toHaveBeenCalled();
  });

  it('exposes a unit of measurement request error without retrying', async () => {
    const error = { status: 404, message: 'Unit of measurement not found' };

    getUnitOfMeasurementMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useUnitOfMeasurementQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getUnitOfMeasurementMock).toHaveBeenCalledTimes(1);
  });
});
