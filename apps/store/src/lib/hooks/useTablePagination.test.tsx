import { act, renderHook } from '@testing-library/react';
import type { PageMetadata } from '@/lib/server/types';
import { useTablePagination } from './useTablePagination';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/products/categories',
  push: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  usePathname: () => navigationMocks.pathname,
  useRouter: () => ({
    push: navigationMocks.push,
    replace: navigationMocks.replace,
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

describe('useTablePagination', () => {
  beforeEach(() => {
    navigationMocks.pathname = '/products/categories';
    navigationMocks.push.mockReset();
    navigationMocks.replace.mockReset();
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
    expect(navigationMocks.replace).not.toHaveBeenCalled();
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

    act(() => result.current.onPageChange(2));

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

    act(() => result.current.onRowsPerPageChange?.(25, {} as never));

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

  it('replaces an out-of-range page after refreshed metadata reduces the page count', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'page=3&size=10&sort=name%2Casc&sort=id%2Cdesc&filter=active'
    );
    const { result, rerender } = renderHook(
      (pageMetadata: PageMetadata) => useTablePagination({ pageMetadata }),
      {
        initialProps: {
          size: 10,
          number: 2,
          totalElements: 21,
          totalPages: 3,
        },
      }
    );

    expect(navigationMocks.replace).not.toHaveBeenCalled();

    rerender({ size: 10, number: 2, totalElements: 20, totalPages: 2 });

    expect(navigationMocks.replace).toHaveBeenCalledExactlyOnceWith(
      '/products/categories?page=2&size=10&sort=name%2Casc&sort=id%2Cdesc&filter=active',
      { scroll: false }
    );
    expect(result.current.page).toBe(1);
    expect(navigationMocks.push).not.toHaveBeenCalled();

    rerender({ size: 10, number: 2, totalElements: 20, totalPages: 2 });

    expect(navigationMocks.replace).toHaveBeenCalledTimes(1);
  });

  it('returns to page one when no records remain', () => {
    navigationMocks.searchParams = new URLSearchParams('page=2&size=10');

    const { result } = renderHook(() =>
      useTablePagination({
        pageMetadata: {
          size: 10,
          number: 1,
          totalElements: 0,
          totalPages: 0,
        },
      })
    );

    expect(result.current.page).toBe(0);
    expect(navigationMocks.replace).toHaveBeenCalledExactlyOnceWith(
      '/products/categories?page=1&size=10',
      { scroll: false }
    );
  });

  it('waits for metadata before correcting the requested page', () => {
    navigationMocks.searchParams = new URLSearchParams('page=2&size=10');

    const { result } = renderHook(() => useTablePagination({}));

    expect(result.current.page).toBe(1);
    expect(navigationMocks.replace).not.toHaveBeenCalled();
  });

  it.each([
    { size: 10, number: 0, totalElements: 10, totalPages: 1 },
    { size: 25, number: 1, totalElements: 20, totalPages: 1 },
  ])('ignores metadata from another page or page size: %j', (pageMetadata) => {
    navigationMocks.searchParams = new URLSearchParams('page=2&size=10');

    const { result } = renderHook(() => useTablePagination({ pageMetadata }));

    expect(result.current.page).toBe(1);
    expect(navigationMocks.replace).not.toHaveBeenCalled();
  });
});
