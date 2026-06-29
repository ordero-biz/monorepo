import { renderHook, waitFor } from '@testing-library/react';
import { getAttributeValues } from '@/lib/client/api/attributes';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useAttributeValuesQuery } from './useAttributeValuesQuery';

vi.mock('@/lib/client/api/attributes', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/client/api/attributes')
  >('@/lib/client/api/attributes');

  return {
    ...actual,
    getAttributeValues: vi.fn(),
  };
});

const getAttributeValuesMock = vi.mocked(getAttributeValues);

describe('attribute values query', () => {
  beforeEach(() => {
    getAttributeValuesMock.mockReset();
  });

  it('returns attribute values by attribute id', async () => {
    const values = [
      {
        id: 2,
        name: 'Medium',
        sortOrder: 20,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    ];

    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: values,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useAttributeValuesQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(values);
    expect(getAttributeValuesMock).toHaveBeenCalledWith('1');
  });

  it('exposes the attribute values request error without retrying', async () => {
    const error = {
      status: 500,
      message: 'Unable to load attribute values',
    };

    getAttributeValuesMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useAttributeValuesQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getAttributeValuesMock).toHaveBeenCalledTimes(1);
  });
});
