import { render, screen, waitFor } from '@testing-library/react';
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

const StoresStatus = () => {
  const stores = useStoresQuery();

  if (stores.isPending) {
    return <span>Loading</span>;
  }

  return <span>{stores.data?.length ?? 0} stores</span>;
};

describe('stores queries', () => {
  beforeEach(() => {
    getStoresMock.mockReset();
  });

  it('caches the stores query while data is fresh', async () => {
    getStoresMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        },
      ],
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { rerender } = render(<StoresStatus />, {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(screen.getByText('1 stores')).toBeVisible());

    rerender(<StoresStatus />);

    await waitFor(() => expect(screen.getByText('1 stores')).toBeVisible());
    expect(getStoresMock).toHaveBeenCalledTimes(1);
  });
});
