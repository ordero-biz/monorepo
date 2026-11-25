import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteTransfer, getTransfers } from '@/lib/client/api/transfers';
import { getTransferDetailRoute } from '@/lib/client/routes';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { Transfer } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransfersList } from './TransfersList';

const mocks = vi.hoisted(() => ({
  pathname: '/warehouse/transfers',
  push: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  usePathname: () => mocks.pathname,
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  deleteTransfer: vi.fn(),
  getTransfers: vi.fn(),
}));

const deleteTransferMock = vi.mocked(deleteTransfer);
const getTransfersMock = vi.mocked(getTransfers);

const transfer = {
  id: 1,
  sourceWarehouse: {
    id: 2,
    name: 'Main Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  destinationWarehouse: {
    id: 3,
    name: 'East Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  transferNumber: 'TR-001',
  status: TRANSFER_STATUS.DRAFT,
  comment: null,
  dispatchedAt: null,
  completedAt: null,
  createdAt: '2026-08-01T10:30:00.000Z',
  version: 1,
} satisfies Transfer;

const { setup } = prepareStoreSetup({
  component: TransfersList,
});

describe('TransfersList', () => {
  beforeEach(() => {
    deleteTransferMock.mockReset();
    getTransfersMock.mockReset();
    mocks.push.mockReset();
    mocks.replace.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while transfers are loading', () => {
    getTransfersMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading transfers...')).toBeVisible();
  });

  it('renders an error state and retries loading transfers', async () => {
    getTransfersMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load transfers.' },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [transfer],
          page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
        },
      });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load your transfers right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('TR-001')).toBeVisible();
    expect(getTransfersMock).toHaveBeenCalledTimes(2);
  });

  it('renders transfer rows from the API response', async () => {
    getTransfersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [transfer],
        page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
      },
    });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Transfers list' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'TR-001' })).toHaveAttribute(
      'href',
      getTransferDetailRoute(1)
    );
    expect(screen.getByText('Main Warehouse')).toBeVisible();
    expect(screen.getByText('East Warehouse')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('01 Aug 2026')).toBeVisible();
    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent)
    ).toEqual([
      'Transfer number',
      'From warehouse',
      'To warehouse',
      'Status',
      'Created at',
      '',
    ]);
  });

  it('deletes a draft transfer from the row actions menu and hides actions for non-draft rows', async () => {
    getTransfersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          transfer,
          {
            ...transfer,
            id: 2,
            transferNumber: 'TR-002',
            status: TRANSFER_STATUS.IN_TRANSIT,
          },
          {
            ...transfer,
            id: 3,
            transferNumber: 'TR-003',
            status: TRANSFER_STATUS.COMPLETED,
          },
        ],
        page: { size: 10, number: 0, totalElements: 3, totalPages: 1 },
      },
    });
    deleteTransferMock.mockResolvedValue({ ok: true, data: undefined });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByRole('button', { name: 'Actions for TR-001' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Actions for TR-002' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Actions for TR-003' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Actions for TR-001' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete transfer' });
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete the "TR-001" transfer?'
    );

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(deleteTransferMock).toHaveBeenCalledWith(1);
    await waitFor(() =>
      expect(getTransfersMock).toHaveBeenCalledTimes(2)
    );
    expect(
      screen.queryByRole('dialog', { name: 'Delete transfer' })
    ).not.toBeInTheDocument();
  });

  it('returns to the remaining records after deleting the last page through the row action', async () => {
    mocks.searchParams = new URLSearchParams('page=2&size=10');
    const lastTransfer = {
      ...transfer,
      id: 11,
      transferNumber: 'TR-011',
    };
    getTransfersMock
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [lastTransfer],
          page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [],
          page: { size: 10, number: 1, totalElements: 10, totalPages: 1 },
        },
      })
      .mockResolvedValue({
        ok: true,
        data: {
          content: Array.from({ length: 10 }, (_, index) => ({
            ...lastTransfer,
            id: index + 1,
            transferNumber: `TR-${String(index + 1).padStart(3, '0')}`,
          })),
          page: { size: 10, number: 0, totalElements: 10, totalPages: 1 },
        },
      });
    deleteTransferMock.mockResolvedValue({ ok: true, data: undefined });
    const user = userEvent.setup();
    const { renderResult } = setup({
      paginationInput: { page: 2, size: 10 },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Actions for TR-011' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Delete transfer' })).getByRole(
        'button',
        { name: 'Delete' }
      )
    );

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledExactlyOnceWith(
        '/warehouse/transfers?page=1&size=10',
        { scroll: false }
      )
    );
    expect(deleteTransferMock).toHaveBeenCalledExactlyOnceWith(11);

    mocks.searchParams = new URLSearchParams('page=1&size=10');
    renderResult.rerender({ paginationInput: { page: 1, size: 10 } });

    expect(await screen.findByRole('link', { name: 'TR-001' })).toBeVisible();
    expect(getTransfersMock).toHaveBeenLastCalledWith({ page: 1, size: 10 });
    expect(screen.queryByText('No transfers found.')).not.toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Table pagination' })
    ).toHaveTextContent('1-10 of 10');
  });

  it('requests transfers with pagination input', async () => {
    getTransfersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { size: 10, number: 1, totalElements: 0, totalPages: 0 },
      },
    });

    const { paginationInput } = setup({
      paginationInput: { page: 2, size: 10, sort: ['createdAt,desc'] },
    });

    await waitFor(() => {
      expect(getTransfersMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('sorts the current page by status and creation date only', async () => {
    getTransfersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            ...transfer,
            id: 2,
            transferNumber: 'TR-002',
            createdAt: '2026-08-03T10:30:00.000Z',
          },
          transfer,
        ],
        page: { size: 10, number: 0, totalElements: 2, totalPages: 1 },
      },
    });
    const user = userEvent.setup();

    setup();

    const table = await screen.findByRole('table', { name: 'Transfers list' });
    const getRowNumbers = () =>
      within(table)
        .getAllByRole('row')
        .slice(1)
        .map((row) => within(row).getByRole('link').textContent);
    const [header] = within(table).getAllByRole('row');

    expect(within(header).getAllByRole('button')).toHaveLength(2);
    expect(getRowNumbers()).toEqual(['TR-002', 'TR-001']);

    await user.click(
      within(header).getByRole('button', { name: /^Created at\./ })
    );

    expect(getRowNumbers()).toEqual(['TR-001', 'TR-002']);
  });

  it('renders an empty state when there are no transfers', async () => {
    getTransfersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
      },
    });

    setup();

    expect(await screen.findByText('No transfers found.')).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams(
      'page=1&size=25&sort=createdAt%2Cdesc'
    );
    getTransfersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { size: 10, number: 0, totalElements: 51, totalPages: 3 },
      },
    });
    const user = userEvent.setup();

    setup({
      paginationInput: { page: 1, size: 10, sort: ['createdAt,desc'] },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );

    expect(mocks.push).toHaveBeenCalledWith(
      '/warehouse/transfers?page=2&size=25&sort=createdAt%2Cdesc',
      { scroll: false }
    );
  });
});
