import { renderHook, waitFor } from '@testing-library/react';
import { getCategories } from '@/lib/client/api/categories';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useCategoriesQuery } from './useCategoriesQuery';

const mocks = vi.hoisted(() => ({
  getCategories: vi.fn(),
}));

vi.mock('@/lib/client/api/categories', () => ({
  getCategories: mocks.getCategories,
}));

const getCategoriesMock = vi.mocked(getCategories);

describe('categories queries', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
  });

  it('returns categories data and caches the query while data is fresh', async () => {
    const categories = {
      content: [
        {
          id: 1,
          name: 'Shoes',
          sortOrder: 10,
          color: '#2563eb',
          createdAt: '2026-07-01T10:54:34.839Z',
          parentCategory: {
            id: 2,
            name: 'Fashion',
            createdAt: '2026-06-30T10:54:34.839Z',
          },
        },
      ],
      page: {
        size: 25,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };

    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: categories,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(() => useCategoriesQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(categories);

    rerender();

    expect(result.current.data).toEqual(categories);
    expect(getCategoriesMock).toHaveBeenCalledTimes(1);
  });

  it('requests categories with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 2,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useCategoriesQuery(paginationInput), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getCategoriesMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes the categories request error without retrying', async () => {
    const error = {
      status: 500,
      message: 'Unable to load categories',
    };

    getCategoriesMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useCategoriesQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getCategoriesMock).toHaveBeenCalledTimes(1);
  });
});
