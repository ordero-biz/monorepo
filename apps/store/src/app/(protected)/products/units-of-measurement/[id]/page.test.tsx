import { render, screen } from '@testing-library/react';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getServerUnitOfMeasurement } from '@/lib/server/api/units-of-measurement';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import UnitOfMeasurementDetailPage from './page';

vi.mock('@/features/units-of-measurement', async () => ({
  ...(await vi.importActual<typeof import('@/features/units-of-measurement')>(
    '@/features/units-of-measurement'
  )),
  UnitOfMeasurementDetail: ({
    unitOfMeasurementId,
  }: {
    unitOfMeasurementId: string;
  }) => <div>Unit of measurement detail {unitOfMeasurementId}</div>,
}));

vi.mock('@/lib/server/api/units-of-measurement', () => ({
  getServerUnitOfMeasurement: vi.fn(),
}));

const getServerUnitOfMeasurementMock = vi.mocked(getServerUnitOfMeasurement);

describe('UnitOfMeasurementDetailPage', () => {
  beforeEach(() => {
    getServerUnitOfMeasurementMock.mockReset();
  });

  it('prefetches unit of measurement details and hydrates the query cache', async () => {
    const unitOfMeasurement = {
      id: 1,
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });

    render(
      await UnitOfMeasurementDetailPage({
        params: Promise.resolve({ id: '1' }),
      }),
      { wrapper: TestQueryProvider }
    );

    expect(screen.getByText('Unit of measurement detail 1')).toBeVisible();
    expect(getServerUnitOfMeasurementMock).toHaveBeenCalledWith('1');
    expect(
      queryClient.getQueryData(unitsOfMeasurementQueryKeys.detail('1'))
    ).toEqual(unitOfMeasurement);
  });
});
