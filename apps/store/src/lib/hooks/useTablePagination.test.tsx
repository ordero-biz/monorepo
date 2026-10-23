import { act, renderHook } from '@testing-library/react';
import { getTablePagination, useTablePagination } from './useTablePagination';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/products/categories',
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

describe('useTablePagination', () => {
  it.each([
    { page: 2, totalPages: 1, targetPage: 1 },
    { page: 3, totalPages: 2, targetPage: 2 },
    { page: 3, totalPages: 0, targetPage: 1 },
  ])('corrects page $page to $targetPage from the refreshed response', ({
    page,
    totalPages,
    targetPage,
  }) => {
    const setPagination = vi.fn();
    const pagination = getTablePagination({
      pagination: { page, size: 10, setPagination },
    });

    expect(setPagination).not.toHaveBeenCalled();

    pagination.correctPage({
      size: 10,
      number: page - 1,
      totalElements: totalPages * 10,
      totalPages,
    });

    expect(setPagination).toHaveBeenCalledExactlyOnceWith({
      navigationType: 'replace',
      page: targetPage,
      size: 10,
    });
  });

  it.each([
    { size: 10, number: 2, totalElements: 21, totalPages: 3 },
    { size: 10, number: 0, totalElements: 10, totalPages: 1 },
    { size: 25, number: 2, totalElements: 25, totalPages: 1 },
    undefined,
  ])('does not navigate for an existing page or mismatched or missing response: %j', (pageMetadata) => {
    const setPagination = vi.fn();
    const pagination = getTablePagination({
      pagination: { page: 3, size: 10, setPagination },
    });

    pagination.correctPage(pageMetadata);

    expect(setPagination).not.toHaveBeenCalled();
  });

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
});
