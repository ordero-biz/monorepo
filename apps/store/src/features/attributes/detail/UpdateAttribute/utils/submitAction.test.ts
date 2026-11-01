import { updateAttribute } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import {
  getAttributeUpdateChanges,
  submitUpdateAttribute,
} from './submitAction';

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

  it('normalizes form values before creating the update patch', () => {
    expect(
      getAttributeUpdateChanges({
        initialName: ' Color ',
        formValue: { name: ' Material ' },
      })
    ).toEqual({ name: 'Material' });
  });

  it('returns no patch when normalized form values are unchanged', () => {
    expect(
      getAttributeUpdateChanges({
        initialName: 'Color',
        formValue: { name: ' Color ' },
      })
    ).toBeUndefined();
  });

  it('transfers prepared attribute update data', async () => {
    const attribute = {
      id: 7,
      name: 'Material',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-06-25T18:13:29.608Z',
    };
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: attribute,
    });

    await expect(
      submitUpdateAttribute({
        attributeId: 7,
        submitData: { name: 'Material' },
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
        submitData: { name: 'Material' },
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
