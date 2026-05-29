import { render, screen, waitFor } from '@testing-library/react';
import { getAttribute } from '@/lib/client/api';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useAttributeQuery } from './useAttributeQuery';

vi.mock('@/lib/client/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/client/api')>(
      '@/lib/client/api'
    );

  return {
    ...actual,
    getAttribute: vi.fn(),
  };
});

const getAttributeMock = vi.mocked(getAttribute);

const AttributeStatus = ({ attributeId }: { attributeId: string }) => {
  const attribute = useAttributeQuery(attributeId);

  if (attribute.isPending) {
    return <span>Loading</span>;
  }

  return <span>{attribute.data?.name ?? 'Missing'}</span>;
};

describe('attribute detail query', () => {
  beforeEach(() => {
    getAttributeMock.mockReset();
  });

  it('caches the attribute detail query while data is fresh', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Size',
        sortOrder: 10,
        values: ['S', 'M', 'L'],
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { rerender } = render(<AttributeStatus attributeId="1" />, {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(screen.getByText('Size')).toBeVisible());

    rerender(<AttributeStatus attributeId="1" />);

    await waitFor(() => expect(screen.getByText('Size')).toBeVisible());
    expect(getAttributeMock).toHaveBeenCalledTimes(1);
  });
});
