import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { POST as logout } from './route';

const fetchMock = vi.fn();

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clears the auth cookie after logout', async () => {
    const response = await logout();

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});
