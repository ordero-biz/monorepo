import { updateAttributeValue } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
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

  it('maps known backend error codes to submit action errors', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_VALUE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
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
        fieldErrors: undefined,
        formError: 'Active attribute values cannot be edited',
      },
    });
  });
});
