import { createAttribute } from '@/lib/client/api/attributes';
import {
  ATTRIBUTE_STATUS,
  ATTRIBUTE_VALUE_STATUS,
} from '@/lib/domain/attributes/constants';
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
      status: 'DRAFT' as const,
      createdAt: '2026-05-26T20:55:51.542Z',
    };
    createAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });

    await expect(
      submitCreateAttribute({
        name: '  Material  ',
        status: ATTRIBUTE_STATUS.ACTIVE,
        attributeValues: [
          {
            id: 'attribute-value-0',
            status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
            value: '  Cotton  ',
          },
          {
            id: 'attribute-value-1',
            status: ATTRIBUTE_VALUE_STATUS.DRAFT,
            value: '   ',
          },
          {
            id: 'attribute-value-2',
            status: ATTRIBUTE_VALUE_STATUS.DRAFT,
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
      status: ATTRIBUTE_STATUS.ACTIVE,
      attributeValues: [
        {
          name: 'Cotton',
          sortOrder: 0,
          status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
        },
        {
          name: 'Linen',
          sortOrder: 0,
          status: ATTRIBUTE_VALUE_STATUS.DRAFT,
        },
      ],
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
        status: ATTRIBUTE_STATUS.DRAFT,
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

  it('forces all values to draft when the attribute is a draft', async () => {
    const attribute = {
      id: 7,
      name: 'Material',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-05-26T20:55:51.542Z',
    };
    createAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });

    await submitCreateAttribute({
      name: 'Material',
      status: ATTRIBUTE_STATUS.DRAFT,
      attributeValues: [
        {
          id: 'attribute-value-0',
          status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
          value: 'Cotton',
        },
      ],
    });

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
      status: ATTRIBUTE_STATUS.DRAFT,
      attributeValues: [
        {
          name: 'Cotton',
          sortOrder: 0,
          status: ATTRIBUTE_VALUE_STATUS.DRAFT,
        },
      ],
    });
  });
});
