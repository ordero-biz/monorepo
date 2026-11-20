import { render, screen } from '@testing-library/react';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { getServerTransfers } from '@/lib/server/api/transfers';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import TransfersPage from './page';

const transfersListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/features/transfers')>(
    '@/features/transfers'
  )),
  TransfersList: (props: { paginationInput?: PaginationSearchInput }) => {
    transfersListMock(props);

    return <div>Transfers list</div>;
  },
  TransfersListHeader: () => <div>Transfers header</div>,
}));

vi.mock('@/lib/server/api/transfers', () => ({
  getServerTransfers: vi.fn(),
}));

const getServerTransfersMock = vi.mocked(getServerTransfers);

describe('TransfersPage', () => {
  beforeEach(() => {
    getServerTransfersMock.mockReset();
    transfersListMock.mockReset();
  });

  it('prefetches transfers and hydrates the query cache', async () => {
    const transfers = {
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    getServerTransfersMock.mockResolvedValue({ ok: true, data: transfers });

    render(await TransfersPage(), { wrapper: TestQueryProvider });

    expect(screen.getByText('Transfers header')).toBeVisible();
    expect(screen.getByText('Transfers list')).toBeVisible();
    expect(getServerTransfersMock).toHaveBeenCalledWith({ page: 1, size: 10 });
    expect(transfersListMock).toHaveBeenCalledWith({
      paginationInput: { page: 1, size: 10 },
    });
    expect(
      queryClient.getQueryData(
        transfersQueryKeys.listPage({ page: 1, size: 10 })
      )
    ).toEqual(transfers);
  });

  it('prefetches transfers with pagination from search params', async () => {
    const transfers = {
      content: [],
      page: { size: 25, number: 1, totalElements: 0, totalPages: 0 },
    };
    const paginationInput = {
      page: 2,
      size: 25,
      sort: ['createdAt,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    getServerTransfersMock.mockResolvedValue({ ok: true, data: transfers });

    render(
      await TransfersPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '25',
          sort: 'createdAt,desc',
        }),
      }),
      { wrapper: TestQueryProvider }
    );

    expect(getServerTransfersMock).toHaveBeenCalledWith(paginationInput);
    expect(transfersListMock).toHaveBeenCalledWith({ paginationInput });
    expect(
      queryClient.getQueryData(transfersQueryKeys.listPage(paginationInput))
    ).toEqual(transfers);
  });
});
