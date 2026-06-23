import { renderHook, waitFor } from '@testing-library/react';
import { getStores } from '@/lib/client/api';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useStoresQuery } from './useStoresQuery';

vi.mock('@/lib/client/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/client/api')>(
      '@/lib/client/api'
    );

  return {
    ...actual,
    getStores: vi.fn(),
  };
});

const getStoresMock = vi.mocked(getStores);

describe('stores queries', () => {
  beforeEach(() => {
    getStoresMock.mockReset();
  });

  it('returns stores data and caches the query while data is fresh', async () => {
    const stores = [
      {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    ];

    getStoresMock.mockResolvedValue({
      ok: true,
      data: stores,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(() => useStoresQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(stores);

    rerender();

    expect(result.current.data).toEqual(stores);
    expect(getStoresMock).toHaveBeenCalledTimes(1);
  });

  it('exposes the stores request error without retrying', async () => {
    const error = {
      status: 500,
      message: 'Unable to load stores',
    };

    getStoresMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useStoresQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getStoresMock).toHaveBeenCalledTimes(1);
  });
});
