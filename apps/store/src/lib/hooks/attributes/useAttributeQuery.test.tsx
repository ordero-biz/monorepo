import { renderHook, waitFor } from '@testing-library/react';
import { getAttribute } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useAttributeQuery } from './useAttributeQuery';

vi.mock('@/lib/client/api/attributes', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/client/api/attributes')
  >('@/lib/client/api/attributes');

  return {
    ...actual,
    getAttribute: vi.fn(),
  };
});

const getAttributeMock = vi.mocked(getAttribute);

describe('attribute query', () => {
  beforeEach(() => {
    getAttributeMock.mockReset();
  });

  it('returns an attribute detail by id', async () => {
    const attribute = {
      id: 1,
      name: 'Size',
      sortOrder: 10,
      createdAt: '2026-05-26T20:55:51.542Z',
    };

    getAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useAttributeQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(attribute);
    expect(getAttributeMock).toHaveBeenCalledWith('1');
  });

  it('reads hydrated attribute detail from the cache without a client request', async () => {
    const attribute = {
      id: 1,
      name: 'Size',
      sortOrder: 10,
      createdAt: '2026-05-26T20:55:51.542Z',
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    queryClient.setQueryData(attributesQueryKeys.detail('1'), attribute);

    const { result } = renderHook(() => useAttributeQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(attribute);
    expect(getAttributeMock).not.toHaveBeenCalled();
  });

  it('exposes the attribute detail request error without retrying', async () => {
    const error = {
      status: 404,
      message: 'Attribute not found',
    };

    getAttributeMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useAttributeQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getAttributeMock).toHaveBeenCalledTimes(1);
  });
});
