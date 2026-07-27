import { act, renderHook } from '@testing-library/react';
import { PRODUCTS_LIST_MODE } from '../constants';
import { useProductsListMode } from './useProductsListMode';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/products',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationMocks.pathname,
  useRouter: () => ({
    push: navigationMocks.push,
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

describe('useProductsListMode', () => {
  beforeEach(() => {
    navigationMocks.push.mockReset();
    navigationMocks.searchParams = new URLSearchParams();
  });

  it('defaults to product variants', () => {
    const { result } = renderHook(() => useProductsListMode({}));

    expect(result.current.listMode).toBe(PRODUCTS_LIST_MODE.productVariants);
  });

  it('uses the list mode from the URL', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'listMode=product-groups'
    );

    const { result } = renderHook(() => useProductsListMode({}));

    expect(result.current.listMode).toBe(PRODUCTS_LIST_MODE.productGroups);
  });

  it('updates the list mode and resets pagination in one navigation', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'page=2&size=25&sort=name%2Casc'
    );
    const { result } = renderHook(() =>
      useProductsListMode({
        paginationInput: {
          page: 2,
          size: 25,
          sort: ['name,asc'],
        },
      })
    );

    act(() => result.current.setListMode(PRODUCTS_LIST_MODE.productGroups));

    expect(result.current.listMode).toBe(PRODUCTS_LIST_MODE.productGroups);
    expect(result.current.paginationInput).toEqual({
      page: 0,
      size: 25,
      sort: ['name,asc'],
    });
    expect(navigationMocks.push).toHaveBeenCalledWith(
      '/products?page=0&size=25&sort=name%2Casc&listMode=product-groups',
      { scroll: false }
    );
  });
});
