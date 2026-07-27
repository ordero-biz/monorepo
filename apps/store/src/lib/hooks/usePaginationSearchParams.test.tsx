import { act, renderHook } from '@testing-library/react';
import { usePaginationSearchParams } from './usePaginationSearchParams';

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

describe('usePaginationSearchParams', () => {
  beforeEach(() => {
    navigationMocks.push.mockReset();
    navigationMocks.searchParams = new URLSearchParams();
  });

  it('resets pagination while preserving active filters', () => {
    navigationMocks.searchParams = new URLSearchParams(
      'page=2&size=25&sort=name%2Casc&filter=active'
    );
    const { result } = renderHook(() =>
      usePaginationSearchParams({})
    );

    act(() => result.current.resetPagination());

    expect(result.current.paginationInput).toEqual({
      page: 0,
      size: 25,
      sort: ['name,asc'],
    });
    expect(navigationMocks.push).toHaveBeenCalledWith(
      '/products?page=0&size=25&sort=name%2Casc&filter=active',
      { scroll: false }
    );
  });

  it('does not navigate when pagination is already reset', () => {
    const { result } = renderHook(() => usePaginationSearchParams({}));

    act(() => result.current.resetPagination());

    expect(navigationMocks.push).not.toHaveBeenCalled();
  });
});
