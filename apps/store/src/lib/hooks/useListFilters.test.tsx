import { act, renderHook } from '@testing-library/react';
import { useListFilters } from './useListFilters';

describe('useListFilters', () => {
  it('updates a filter while preserving the remaining filters', () => {
    const { result } = renderHook(() =>
      useListFilters({
        initialFilters: {
          mode: 'products',
          status: 'all',
        },
      })
    );

    act(() => result.current.setFilters({ mode: 'product-groups' }));

    expect(result.current.filters).toEqual({
      mode: 'product-groups',
      status: 'all',
    });
  });

  it('restores initial filters', () => {
    const { result } = renderHook(() =>
      useListFilters({
        initialFilters: {
          mode: 'products',
        },
      })
    );

    act(() => result.current.setFilters({ mode: 'product-groups' }));
    act(() => result.current.resetFilters());

    expect(result.current.filters).toEqual({ mode: 'products' });
  });
});
