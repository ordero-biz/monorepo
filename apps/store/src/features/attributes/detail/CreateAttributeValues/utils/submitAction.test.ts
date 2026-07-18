import { createAttributeValues } from '@/lib/client/api/attributes';
import { submitCreateAttributeValues } from './submitAction';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  createAttributeValues: vi.fn(),
}));

const createAttributeValuesMock = vi.mocked(createAttributeValues);

describe('submitCreateAttributeValues', () => {
  beforeEach(() => {
    createAttributeValuesMock.mockReset();
  });

  it('normalizes non-empty values before adding them', async () => {
    const attributeValues = [
      {
        id: 3,
        name: 'Green',
        sortOrder: 0,
        createdAt: '2026-07-18T07:53:03.586Z',
      },
    ];
    createAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: attributeValues,
    });

    await expect(
      submitCreateAttributeValues({
        attributeId: 7,
        value: {
          attributeValues: [
            {
              id: 'attribute-value-0',
              value: '  Green  ',
            },
            {
              id: 'attribute-value-1',
              value: '   ',
            },
          ],
        },
      })
    ).resolves.toEqual({
      ok: true,
      data: attributeValues,
    });

    expect(createAttributeValuesMock).toHaveBeenCalledWith({
      attributeId: 7,
      attributeValues: [
        {
          name: 'Green',
          sortOrder: 0,
        },
      ],
    });
  });

  it('maps backend errors to form errors', async () => {
    createAttributeValuesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute values could not be added.',
        fieldErrors: {
          'attributeValues[0].name': 'Attribute value already exists.',
        },
      },
    });

    await expect(
      submitCreateAttributeValues({
        attributeId: 7,
        value: {
          attributeValues: [
            {
              id: 'attribute-value-0',
              value: 'Green',
            },
          ],
        },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          'attributeValues[0].value': 'Attribute value already exists.',
        },
        formError: 'Attribute values could not be added.',
      },
    });
  });
});
