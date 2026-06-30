import { updateAttributeValue } from '@/lib/client/api/attributes';
import { submitUpdateAttributeValue } from './submitAction';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttributeValue: vi.fn(),
}));

const updateAttributeValueMock = vi.mocked(updateAttributeValue);

describe('submitUpdateAttributeValue', () => {
  beforeEach(() => {
    updateAttributeValueMock.mockReset();
  });

  it('normalizes form values before updating the attribute value', async () => {
    const attributeValue = {
      id: 3,
      name: 'Navy',
      sortOrder: 0,
      createdAt: '2026-06-25T18:13:29.608Z',
    };
    updateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: attributeValue,
    });

    await expect(
      submitUpdateAttributeValue({
        attributeValueId: 3,
        value: {
          name: '  Navy  ',
          sortOrder: 0,
        },
      })
    ).resolves.toEqual({
      ok: true,
      data: attributeValue,
    });

    expect(updateAttributeValueMock).toHaveBeenCalledWith({
      attributeValueId: 3,
      name: 'Navy',
      sortOrder: 0,
    });
  });

  it('maps backend errors to submit action errors', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute value update failed.',
        fieldErrors: {
          name: 'Attribute value name already exists.',
        },
      },
    });

    await expect(
      submitUpdateAttributeValue({
        attributeValueId: 3,
        value: {
          name: 'Navy',
          sortOrder: 0,
        },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Attribute value name already exists.',
        },
        formError: 'Attribute value update failed.',
      },
    });
  });
});
