import { render, screen, waitFor } from '@testing-library/react';
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

const AttributesStatus = () => {
  const attributes = useAttributesQuery();

  if (attributes.isPending) {
    return <span>Loading</span>;
  }

  return <span>{attributes.data?.content.length ?? 0} attributes</span>;
};

describe('attributes queries', () => {
  beforeEach(() => {
    getAttributesMock.mockReset();
  });

  it('caches the attributes query while data is fresh', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            createdAt: '2026-05-26T20:55:51.542Z',
          },
        ],
        page: {
          size: 25,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { rerender } = render(<AttributesStatus />, {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(screen.getByText('1 attributes')).toBeVisible());

    rerender(<AttributesStatus />);

    await waitFor(() => expect(screen.getByText('1 attributes')).toBeVisible());
    expect(getAttributesMock).toHaveBeenCalledTimes(1);
  });
});
