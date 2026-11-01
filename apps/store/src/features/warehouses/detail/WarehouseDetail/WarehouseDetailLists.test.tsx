import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getWarehouseStock,
  getWarehouseSupplies,
} from '@/lib/client/api/warehouses';
import type { WarehouseSupply } from '@/lib/domain/warehouses/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { WarehouseDetailListsProps } from './types';
import { WarehouseDetailLists } from './WarehouseDetailLists';

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/warehouse/7',
  useSearchParams: () => navigation.searchParams,
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
}));
vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouseStock: vi.fn(),
  getWarehouseSupplies: vi.fn(),
}));

const supply: WarehouseSupply = {
  id: 48,
  supplier: { id: 2, name: 'Roastworks', status: 'ACTIVE' },
  status: 'COMPLETED',
  supplyNumber: 'SUP-0048',
  supplierInvoiceNumber: 'INV-148',
  createdAt: '2026-10-28T10:00:00Z',
  totalPrice: 2400,
};
const supplies = {
  content: [supply],
  page: { number: 0, size: 10, totalElements: 21, totalPages: 3 },
};
const { setup } = prepareStoreSetup<WarehouseDetailListsProps>({
  component: WarehouseDetailLists,
  props: { warehouseId: '7', paginationInput: { page: 1, size: 10 } },
});

describe('WarehouseDetailLists', () => {
  beforeEach(() => {
    navigation.push.mockReset();
    navigation.replace.mockReset();
    navigation.searchParams = new URLSearchParams();
    vi.mocked(getWarehouseStock)
      .mockReset()
      .mockResolvedValue({
        ok: true,
        data: {
          content: [],
          page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
        },
      });
    vi.mocked(getWarehouseSupplies)
      .mockReset()
      .mockResolvedValue({ ok: true, data: supplies });
  });

  it.each([
    '',
    'view=unknown',
  ])('defaults to products for %s and fetches only stock', async (search) => {
    navigation.searchParams = new URLSearchParams(search);
    setup();
    expect(
      await screen.findByRole('table', { name: 'Warehouse products' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Products', pressed: true })
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Products' })).toBeVisible();
    expect(screen.getByText('0', { exact: true })).toBeVisible();
    expect(getWarehouseSupplies).not.toHaveBeenCalled();
  });

  it('switches via the URL, resets pagination and sorting, and keeps unrelated parameters', async () => {
    navigation.searchParams = new URLSearchParams(
      'page=3&size=25&sort=quantity,desc&source=overview'
    );
    const user = userEvent.setup();
    const { renderResult } = setup({ paginationInput: { page: 3, size: 25 } });
    await screen.findByRole('table', { name: 'Warehouse products' });
    await user.click(screen.getByRole('button', { name: 'Supplies' }));
    expect(navigation.push).toHaveBeenCalledExactlyOnceWith(
      '/warehouse/7?page=1&size=25&source=overview&view=supplies',
      { scroll: false }
    );
    navigation.searchParams = new URLSearchParams(
      'page=1&size=25&source=overview&view=supplies'
    );
    renderResult.rerender({ paginationInput: { page: 1, size: 25 } });
    expect(
      await screen.findByRole('table', { name: 'Warehouse supplies' })
    ).toBeVisible();
    expect(
      screen.queryByRole('table', { name: 'Warehouse products' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Supplies', pressed: true })
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Supplies' }));
    expect(navigation.push).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Products' }));
    expect(navigation.push).toHaveBeenLastCalledWith(
      '/warehouse/7?page=1&size=25&source=overview&view=products',
      { scroll: false }
    );
  });

  it('renders warehouse supplies and links to details without repeating warehouse or total columns', async () => {
    navigation.searchParams = new URLSearchParams('view=supplies');
    setup();
    const table = await screen.findByRole('table', {
      name: 'Warehouse supplies',
    });
    expect(
      within(table).getByRole('link', { name: 'SUP-0048' })
    ).toHaveAttribute('href', '/warehouse/supplies/48');
    for (const text of ['Roastworks', 'INV-148', '$2,400.00']) {
      expect(within(table).getByText(text)).toBeVisible();
    }
    expect(
      within(table).getByRole('columnheader', { name: 'Supply value' })
    ).toBeVisible();
    expect(
      within(table).queryByRole('columnheader', { name: 'Warehouse' })
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByRole('columnheader', { name: 'Quantity' })
    ).not.toBeInTheDocument();
    expect(getWarehouseSupplies).toHaveBeenCalledExactlyOnceWith('7', {
      page: 1,
      size: 10,
    });
    expect(screen.getByRole('heading', { name: 'Supplies' })).toBeVisible();
    expect(screen.getByText('21', { exact: true })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Products' })
    ).not.toBeInTheDocument();
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => header.textContent)
    ).toEqual([
      'Supply number',
      'Supplier',
      'Invoice number',
      'Supply value',
      'Created at',
    ]);
    expect(getWarehouseStock).not.toHaveBeenCalled();
  });

  it('shows a nullable invoice fallback and zero supply value', async () => {
    navigation.searchParams = new URLSearchParams('view=supplies');
    vi.mocked(getWarehouseSupplies).mockResolvedValue({
      ok: true,
      data: {
        ...supplies,
        content: [
          {
            ...supply,
            status: 'DRAFT',
            supplierInvoiceNumber: null,
            totalPrice: 0,
          },
        ],
      },
    });
    setup();
    const table = await screen.findByRole('table', {
      name: 'Warehouse supplies',
    });
    expect(within(table).getByRole('link', { name: 'SUP-0048' })).toBeVisible();
    expect(within(table).getByText('$0.00')).toBeVisible();
    expect(within(table).getByText('-')).toBeVisible();
  });

  it('keeps the switcher available while supplies load', () => {
    navigation.searchParams = new URLSearchParams('view=supplies');
    vi.mocked(getWarehouseSupplies).mockReturnValue(new Promise(() => {}));
    setup();
    expect(screen.getByText('Loading warehouse supplies...')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Supplies' })).toBeVisible();
    expect(screen.queryByText('0', { exact: true })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Products' })).toBeEnabled();
  });

  it('keeps the switcher available for empty supplies', async () => {
    navigation.searchParams = new URLSearchParams('view=supplies');
    vi.mocked(getWarehouseSupplies).mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
      },
    });
    setup();
    expect(
      await screen.findByText('No supplies for this warehouse yet.')
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Supplies' })).toBeVisible();
    expect(screen.getByText('0', { exact: true })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Products' })).toBeEnabled();
  });

  it('retries supplies after a failure and keeps switching available', async () => {
    navigation.searchParams = new URLSearchParams('view=supplies');
    vi.mocked(getWarehouseSupplies).mockResolvedValueOnce({
      ok: false,
      error: { status: 503, message: 'Unavailable' },
    });
    const user = userEvent.setup();
    setup();
    expect(
      await screen.findByText(
        "We couldn't load this warehouse's supplies right now."
      )
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Products' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByRole('link', { name: 'SUP-0048' })).toBeVisible();
    expect(getWarehouseSupplies).toHaveBeenCalledTimes(2);
  });

  it('renders the server page without slicing it and preserves supplies mode during pagination', async () => {
    navigation.searchParams = new URLSearchParams(
      'view=supplies&page=2&size=10'
    );
    vi.mocked(getWarehouseSupplies).mockResolvedValue({
      ok: true,
      data: { ...supplies, page: { ...supplies.page, number: 1 } },
    });
    const user = userEvent.setup();
    const { paginationInput } = setup({
      paginationInput: { page: 2, size: 10 },
    });
    expect(await screen.findByRole('link', { name: 'SUP-0048' })).toBeVisible();
    expect(screen.getByText('11-20 of 21')).toBeVisible();
    expect(getWarehouseSupplies).toHaveBeenCalledWith('7', paginationInput);
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(navigation.push).toHaveBeenCalledWith(
      '/warehouse/7?view=supplies&page=3&size=10',
      { scroll: false }
    );
  });
});
