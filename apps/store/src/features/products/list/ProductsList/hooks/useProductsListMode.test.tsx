import { act, renderHook } from '@testing-library/react';
import { PRODUCTS_LIST_MODE } from '../constants';
import { useProductsListMode } from './useProductsListMode';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/products',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  usePathname: () => navigationMocks.pathname,
  useRouter: () => ({
    push: navigationMocks.push,
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

describe('useProductsListMode', () => {
  const resetPaginationMock = vi.fn();

  beforeEach(() => {
    resetPaginationMock.mockReset();
    navigationMocks.push.mockReset();
    navigationMocks.searchParams = new URLSearchParams();
  });

  it('defaults to product variants', () => {
    const { result } = renderHook(() =>
      useProductsListMode({ resetPagination: resetPaginationMock })
    );

    expect(result.current.listMode).toBe(PRODUCTS_LIST_MODE.productVariants);
  });

  it('uses the list mode from the URL', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'listMode=product-groups'
    );

    const { result } = renderHook(() =>
      useProductsListMode({ resetPagination: resetPaginationMock })
    );

    expect(result.current.listMode).toBe(PRODUCTS_LIST_MODE.productGroups);
  });

  it('updates the list mode while resetting pagination', () => {
    const { result } = renderHook(() =>
      useProductsListMode({ resetPagination: resetPaginationMock })
    );

    act(() => result.current.setListMode(PRODUCTS_LIST_MODE.productGroups));

    expect(result.current.listMode).toBe(PRODUCTS_LIST_MODE.productGroups);
    expect(resetPaginationMock).toHaveBeenCalledWith({
      updateSearchParams: expect.any(Function),
    });
  });
});
