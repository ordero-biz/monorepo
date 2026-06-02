import { render, screen, waitFor } from '@testing-library/react';
import { getAttributeValues } from '@/lib/client/api';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useAttributeValuesQuery } from './useAttributeValuesQuery';

vi.mock('@/lib/client/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/client/api')>(
      '@/lib/client/api'
    );

  return {
    ...actual,
    getAttributeValues: vi.fn(),
  };
});

const getAttributeValuesMock = vi.mocked(getAttributeValues);

const AttributeValuesStatus = ({ attributeId }: { attributeId: string }) => {
  const attributeValues = useAttributeValuesQuery({
    attributeId,
  });

  if (attributeValues.isPending) {
    return <span>Loading</span>;
  }

  return <span>{attributeValues.data?.length ?? 0} values</span>;
};

describe('attribute values query', () => {
  beforeEach(() => {
    getAttributeValuesMock.mockReset();
  });

  it('caches the attribute values query while data is fresh', async () => {
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          name: 'S',
          sortOrder: 0,
        },
      ],
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { rerender } = render(<AttributeValuesStatus attributeId="1" />, {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(screen.getByText('1 values')).toBeVisible());

    rerender(<AttributeValuesStatus attributeId="1" />);

    await waitFor(() => expect(screen.getByText('1 values')).toBeVisible());
    expect(getAttributeValuesMock).toHaveBeenCalledTimes(1);
  });
});
