import { renderHook, waitFor } from '@testing-library/react';
import { getAttributes } from '@/lib/client/api/attributes';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useAttributesQuery } from './useAttributesQuery';

vi.mock('@/lib/client/api/attributes', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/client/api/attributes')
  >('@/lib/client/api/attributes');

  return {
    ...actual,
    getAttributes: vi.fn(),
  };
});

const getAttributesMock = vi.mocked(getAttributes);

describe('attributes queries', () => {
  beforeEach(() => {
    getAttributesMock.mockReset();
  });

  it('returns attributes data and caches the query while data is fresh', async () => {
    const attributes = {
      content: [
        {
          id: 1,
          name: 'Size',
          sortOrder: 10,
          createdAt: '2026-05-26T20:55:51.542Z',
        },
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };

    getAttributesMock.mockResolvedValue({
      ok: true,
      data: attributes,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(() => useAttributesQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(attributes);

    rerender();

    expect(result.current.data).toEqual(attributes);
    expect(getAttributesMock).toHaveBeenCalledTimes(1);
  });

  it('exposes the attributes request error without retrying', async () => {
    const error = {
      status: 500,
      message: 'Unable to load attributes',
    };

    getAttributesMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useAttributesQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getAttributesMock).toHaveBeenCalledTimes(1);
  });
});
