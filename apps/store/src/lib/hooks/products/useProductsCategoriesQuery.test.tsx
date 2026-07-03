import { renderHook } from '@testing-library/react';
import { useCategoriesQuery } from '@/lib/hooks/categories/useCategoriesQuery';
import { productsCategoriesQueryInput } from './productsCategoriesQueryConfig';
import { useProductsCategoriesQuery } from './useProductsCategoriesQuery';

vi.mock('@/lib/hooks/categories/useCategoriesQuery', () => ({
  useCategoriesQuery: vi.fn(),
}));

const useCategoriesQueryMock = vi.mocked(useCategoriesQuery);

describe('useProductsCategoriesQuery', () => {
  beforeEach(() => {
    useCategoriesQueryMock.mockReset();
  });

  it('returns prepared category options for product select fields', () => {
    useCategoriesQueryMock.mockReturnValue({
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            color: '#2563eb',
            createdAt: '2026-07-01T10:54:34.839Z',
          },
        ],
      },
      isError: false,
      isPending: false,
    } as ReturnType<typeof useCategoriesQuery>);

    const { result } = renderHook(() => useProductsCategoriesQuery());

    expect(useCategoriesQueryMock).toHaveBeenCalledWith(
      productsCategoriesQueryInput
    );
    expect(result.current).toEqual({
      categoryOptions: [
        {
          label: 'Shoes',
          value: '1',
        },
      ],
      isError: false,
      isPending: false,
    });
  });
});
