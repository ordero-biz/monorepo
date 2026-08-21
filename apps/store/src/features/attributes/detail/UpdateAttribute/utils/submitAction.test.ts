import { updateAttribute } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { submitUpdateAttribute } from './submitAction';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttribute: vi.fn(),
}));

const updateAttributeMock = vi.mocked(updateAttribute);

describe('submitUpdateAttribute', () => {
  beforeEach(() => {
    updateAttributeMock.mockReset();
  });

  it('normalizes form values before updating the attribute', async () => {
    const attribute = {
      id: 7,
      name: 'Material',
      sortOrder: 10,
      createdAt: '2026-06-25T18:13:29.608Z',
    };
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });

    await expect(
      submitUpdateAttribute({
        attributeId: 7,
        value: {
          name: '  Material  ',
        },
      })
    ).resolves.toEqual({
      ok: true,
      data: attribute,
    });

    expect(updateAttributeMock).toHaveBeenCalledWith({
      attributeId: 7,
      name: 'Material',
    });
  });

  it('maps known backend error codes to submit action errors', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });

    await expect(
      submitUpdateAttribute({
        attributeId: 7,
        value: {
          name: 'Material',
        },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: undefined,
        formError: 'Active attributes cannot be edited',
      },
    });
  });
});
