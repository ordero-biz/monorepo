import { updateAttribute } from '@/lib/client/api/attributes';
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

  it('maps backend errors to submit action errors', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute update failed.',
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
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
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
        formError: 'Attribute update failed.',
      },
    });
  });
});
