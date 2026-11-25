import { signIn } from '@/lib/client/api/auth';
import { submitSignIn } from './submitAction';

vi.mock('@/lib/client/api/auth', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/auth')>(
    '@/lib/client/api/auth'
  )),
  signIn: vi.fn(),
}));

const signInMock = vi.mocked(signIn);

describe('submitSignIn', () => {
  beforeEach(() => {
    signInMock.mockReset();
  });

  it('submits credentials and returns the authenticated session', async () => {
    const session = {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    };
    signInMock.mockResolvedValue({
      ok: true,
      data: session,
    });

    await expect(
      submitSignIn({
        email: 'admin@gmail.com',
        password: '123456',
      })
    ).resolves.toEqual({
      ok: true,
      data: session,
    });

    expect(signInMock).toHaveBeenCalledWith({
      email: 'admin@gmail.com',
      password: '123456',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    signInMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Sign-in failed.',
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
      },
    });

    await expect(
      submitSignIn({
        email: 'admin@mail.com',
        password: '123456',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
        formError: 'Sign-in failed.',
      },
    });
  });
});
