import { createAttribute } from '@/lib/client/api/attributes';
import { submitCreateAttribute } from './submitAction';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  createAttribute: vi.fn(),
}));

const createAttributeMock = vi.mocked(createAttribute);

describe('submitCreateAttribute', () => {
  beforeEach(() => {
    createAttributeMock.mockReset();
  });

  it('normalizes form values before creating the attribute', async () => {
    const attribute = {
      id: 7,
      name: 'Material',
      sortOrder: 10,
      createdAt: '2026-05-26T20:55:51.542Z',
    };
    createAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });

    await expect(
      submitCreateAttribute({
        name: '  Material  ',
        attributeValues: [
          {
            id: 'attribute-value-0',
            value: '  Cotton  ',
          },
          {
            id: 'attribute-value-1',
            value: '   ',
          },
          {
            id: 'attribute-value-2',
            value: 'Linen',
          },
        ],
      })
    ).resolves.toEqual({
      ok: true,
      data: attribute,
    });

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
      attributeValues: ['Cotton', 'Linen'],
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute creation failed.',
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
      },
    });

    await expect(
      submitCreateAttribute({
        name: 'Material',
        attributeValues: [],
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
        formError: 'Attribute creation failed.',
      },
    });
  });
});
