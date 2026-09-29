import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupplies } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliesList } from './SuppliesList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/supplies',
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
};

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
    expect(screen.getByText('SUP-001')).toBeVisible();
    expect(screen.getByText('Fresh Farms')).toBeVisible();
    expect(screen.getByText('Main warehouse')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('INV-001')).toBeVisible();
    expect(screen.getByText('12')).toBeVisible();
    expect(screen.getByText('48.5')).toBeVisible();
    expect(screen.getByText('01 Aug 2026')).toBeVisible();
  });

  it('requests supplies with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['createdAt,desc'],
    };
    getSuppliesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { size: 10, number: 1, totalElements: 0, totalPages: 0 },
      },
    });

    setup({ paginationInput });

    await waitFor(() => {
      expect(getSuppliesMock).toHaveBeenCalledWith(paginationInput);
    });
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
      '/products/supplies?page=2&size=25&sort=createdAt%2Cdesc',
      { scroll: false }
    );
  });
});
