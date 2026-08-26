import { render, screen } from '@testing-library/react';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getServerUnitsOfMeasurement } from '@/lib/server/api/units-of-measurement';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import UnitsOfMeasurementPage from './page';

const unitsOfMeasurementListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/units-of-measurement', async () => ({
  ...(await vi.importActual<typeof import('@/features/units-of-measurement')>(
    '@/features/units-of-measurement'
  )),
  UnitsOfMeasurementList: (props: {
    paginationInput?: PaginationSearchInput;
  }) => {
    unitsOfMeasurementListMock(props);

    return <div>Units of measurement list</div>;
  },
  UnitsOfMeasurementListHeader: () => <div>Units of measurement header</div>,
}));

vi.mock('@/lib/server/api/units-of-measurement', () => ({
  getServerUnitsOfMeasurement: vi.fn(),
}));

const getServerUnitsOfMeasurementMock = vi.mocked(getServerUnitsOfMeasurement);

describe('UnitsOfMeasurementPage', () => {
  beforeEach(() => {
    getServerUnitsOfMeasurementMock.mockReset();
    unitsOfMeasurementListMock.mockReset();
  });

  it('prefetches units of measurement and hydrates the query cache', async () => {
    const unitsOfMeasurement = {
      content: [
        {
          id: 1,
        status: 'ACTIVE' as const,
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        },
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitsOfMeasurement,
    });

    render(await UnitsOfMeasurementPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Units of measurement header')).toBeVisible();
    expect(screen.getByText('Units of measurement list')).toBeVisible();
    expect(getServerUnitsOfMeasurementMock).toHaveBeenCalledWith({
      page: 1,
      size: 10,
    });
    expect(unitsOfMeasurementListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 1,
        size: 10,
      },
    });
    expect(
      queryClient.getQueryData(
        unitsOfMeasurementQueryKeys.listPage({
          page: 1,
          size: 10,
        })
      )
    ).toEqual(unitsOfMeasurement);
  });

  it('prefetches units of measurement with pagination from the URL search params', async () => {
    const unitsOfMeasurement = {
      content: [],
      page: {
        size: 10,
        number: 2,
        totalElements: 0,
        totalPages: 0,
      },
    };
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc', 'code,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitsOfMeasurement,
    });

    render(
      await UnitsOfMeasurementPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['name,asc', 'code,desc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerUnitsOfMeasurementMock).toHaveBeenCalledWith(
      paginationInput
    );
    expect(unitsOfMeasurementListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(
        unitsOfMeasurementQueryKeys.listPage(paginationInput)
      )
    ).toEqual(unitsOfMeasurement);
  });
});
