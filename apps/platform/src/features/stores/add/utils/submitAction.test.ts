import { createStore } from '@/lib/client/api/stores';
import { submitAddStore } from './submitAction';

vi.mock('@/lib/client/api/stores', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/stores')>(
    '@/lib/client/api/stores'
  )),
  createStore: vi.fn(),
}));

const createStoreMock = vi.mocked(createStore);

describe('submitAddStore', () => {
  beforeEach(() => {
    createStoreMock.mockReset();
  });

  it('normalizes form values before creating the store', async () => {
    const store = {
      id: 1,
      name: 'North Shop',
      subDomain: 'north-shop',
    };
    createStoreMock.mockResolvedValue({
      ok: true,
      data: store,
    });

    await expect(
      submitAddStore({
        name: '  North Shop  ',
        subDomain: '  north-shop  ',
      })
    ).resolves.toEqual({
      ok: true,
      data: store,
    });

    expect(createStoreMock).toHaveBeenCalledWith({
      name: 'North Shop',
      subDomain: 'north-shop',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createStoreMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Validation failed.',
        fieldErrors: {
          subDomain: 'Subdomain is already taken.',
        },
      },
    });

    await expect(
      submitAddStore({
        name: 'North Shop',
        subDomain: 'north-shop',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          subDomain: 'Subdomain is already taken.',
        },
        formError: 'Validation failed.',
      },
    });
  });
});
