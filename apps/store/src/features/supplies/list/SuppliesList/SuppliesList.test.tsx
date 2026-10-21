import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupplies } from '@/lib/client/api/supplies';
import { getSupplyDetailRoute } from '@/lib/client/routes';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { Supply } from '@/lib/domain/supplies/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliesList } from './SuppliesList';

const mocks = vi.hoisted(() => ({
  pathname: '/warehouse/supplies',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  usePathname: () => mocks.pathname,
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupplies: vi.fn(),
}));

const getSuppliesMock = vi.mocked(getSupplies);

const supply = {
  id: 1,
  supplier: { id: 2, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 3, name: 'Main warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',
  supplierInvoiceNumber: 'INV-001',
  totalQuantity: 12,
  totalPrice: 48.5,
  createdAt: '2026-08-01T10:30:00.000Z',
} satisfies Supply;

const { setup } = prepareStoreSetup({
  component: SuppliesList,
});

describe('SuppliesList', () => {
  beforeEach(() => {
    getSuppliesMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while supplies are loading', () => {
    getSuppliesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading supplies...')).toBeVisible();
  });

  it('renders an error state and retries loading supplies', async () => {
    getSuppliesMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load supplies.' },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [supply],
          page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
        },
      });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load your supplies right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('SUP-001')).toBeVisible();
    expect(getSuppliesMock).toHaveBeenCalledTimes(2);
  });

  it('renders supply rows from the API response', async () => {
    getSuppliesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [supply],
        page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
      },
    });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Supplies list' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'SUP-001' })).toHaveAttribute(
      'href',
      getSupplyDetailRoute(1)
    );
    expect(screen.getByText('Fresh Farms')).toBeVisible();
    expect(screen.getByText('Main warehouse')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('INV-001')).toBeVisible();
    expect(screen.getByText('48.5')).toBeVisible();
    expect(screen.getByText('01 Aug 2026')).toBeVisible();
  });

  it('requests supplies with pagination input', async () => {
    getSuppliesMock.mockResolvedValue({
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
      expect(getSuppliesMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('preserves server row order without offering page-local sorting', async () => {
    getSuppliesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          { ...supply, id: 2, supplyNumber: 'SUP-002', totalPrice: 100 },
          supply,
        ],
        page: { size: 10, number: 0, totalElements: 20, totalPages: 2 },
      },
    });

    setup();

    const table = await screen.findByRole('table', { name: 'Supplies list' });
    const [header, firstRow, secondRow] = within(table).getAllByRole('row');

    expect(within(header).queryByRole('button')).not.toBeInTheDocument();
    expect(within(firstRow).getByText('SUP-002')).toBeVisible();
    expect(within(secondRow).getByText('SUP-001')).toBeVisible();
  });

  it('renders an empty state when there are no supplies', async () => {
    getSuppliesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
      },
    });

    setup();

    expect(await screen.findByText('No supplies found.')).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams(
      'page=1&size=25&sort=createdAt%2Cdesc'
    );
    getSuppliesMock.mockResolvedValue({
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
      '/warehouse/supplies?page=2&size=25&sort=createdAt%2Cdesc',
      { scroll: false }
    );
  });
});
