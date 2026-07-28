import { renderHook } from '@testing-library/react';
import { useTablePagination } from './useTablePagination';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/products/categories',
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

describe('useTablePagination', () => {
  beforeEach(() => {
    navigationMocks.pathname = '/products/categories';
    navigationMocks.push.mockReset();
    navigationMocks.searchParams = new URLSearchParams();
  });

  it('reflects page and size from the current URL', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'page=2&size=10&sort=name%2Casc'
    );

    const { result } = renderHook(() =>
      useTablePagination({
        pageMetadata: {
          size: 10,
          number: 1,
          totalElements: 42,
          totalPages: 5,
        },
      })
    );

    expect(result.current.count).toBe(42);
    expect(result.current.page).toBe(1);
    expect(result.current.rowsPerPage).toBe(10);
  });

  it('pushes the next page into the URL while preserving existing params', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'page=2&size=10&sort=name%2Casc&sort=id%2Cdesc&filter=active'
    );

    const { result } = renderHook(() =>
      useTablePagination({
        pageMetadata: {
          size: 10,
          number: 1,
          totalElements: 42,
          totalPages: 5,
        },
      })
    );

    result.current.onPageChange(2);

    expect(navigationMocks.push).toHaveBeenCalledWith(
      '/products/categories?page=3&size=10&sort=name%2Casc&sort=id%2Cdesc&filter=active',
      { scroll: false }
    );
  });

  it('resets to the first page when rows per page changes', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'page=2&size=10&sort=name%2Casc'
    );

    const { result } = renderHook(() =>
      useTablePagination({
        pageMetadata: {
          size: 10,
          number: 1,
          totalElements: 42,
          totalPages: 5,
        },
      })
    );

    result.current.onRowsPerPageChange?.(25, {} as never);

    expect(navigationMocks.push).toHaveBeenCalledWith(
      '/products/categories?page=1&size=25&sort=name%2Casc',
      { scroll: false }
    );
  });

  it('falls back to the server pagination input when the URL is empty', () => {
    const { result } = renderHook(() =>
      useTablePagination({
        paginationInput: {
          page: 1,
          size: 50,
        },
      })
    );

    expect(result.current.page).toBe(0);
    expect(result.current.rowsPerPage).toBe(50);
  });
});
