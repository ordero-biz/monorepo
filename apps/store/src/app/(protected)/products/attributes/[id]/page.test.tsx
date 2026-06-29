import { render, screen } from '@testing-library/react';
import {
  getServerAttribute,
  getServerAttributeValues,
} from '@/lib/api/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import AttributeDetailPage from './page';

vi.mock('@/features/attributes', () => ({
  AttributeDetail: ({ attributeId }: { attributeId: string }) => (
    <div>Attribute detail {attributeId}</div>
  ),
}));

vi.mock('@/lib/api/attributes', () => ({
  getServerAttribute: vi.fn(),
  getServerAttributeValues: vi.fn(),
}));

const getServerAttributeMock = vi.mocked(getServerAttribute);
const getServerAttributeValuesMock = vi.mocked(getServerAttributeValues);

describe('AttributeDetailPage', () => {
  beforeEach(() => {
    getServerAttributeMock.mockReset();
    getServerAttributeValuesMock.mockReset();
  });

  it('prefetches attribute details and hydrates the query cache', async () => {
    const attribute = {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      createdAt: '2026-06-24T20:07:32.467Z',
    };
    const values = [
      {
        id: 3,
        name: 'Blue',
        sortOrder: 0,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    ];
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });
    getServerAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: values,
    });

    render(
      await AttributeDetailPage({
        params: Promise.resolve({ id: '7' }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(screen.getByText('Attribute detail 7')).toBeVisible();
    expect(getServerAttributeMock).toHaveBeenCalledWith('7');
    expect(getServerAttributeValuesMock).toHaveBeenCalledWith('7');
    expect(queryClient.getQueryData(attributesQueryKeys.detail('7'))).toEqual(
      attribute
    );
    expect(queryClient.getQueryData(attributesQueryKeys.values('7'))).toEqual(
      values
    );
  });
});
