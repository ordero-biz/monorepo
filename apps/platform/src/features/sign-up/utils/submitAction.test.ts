import { signUp } from '@/lib/client/api';
import { submitSignUp } from './submitAction';

vi.mock('@/lib/client/api', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api')>(
    '@/lib/client/api'
  )),
  signUp: vi.fn(),
}));

const signUpMock = vi.mocked(signUp);

describe('submitSignUp', () => {
  beforeEach(() => {
    signUpMock.mockReset();
  });

  it('submits account credentials and returns the authenticated session', async () => {
    const session = {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    };
    signUpMock.mockResolvedValue({
      ok: true,
      data: session,
    });

    await expect(
      submitSignUp({
        acceptTerms: true,
        email: 'admin@gmail.com',
        password: '123456',
      })
    ).resolves.toEqual({
      ok: true,
      data: session,
    });

    expect(signUpMock).toHaveBeenCalledWith({
      email: 'admin@gmail.com',
      password: '123456',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    signUpMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: 'Sign-up failed.',
        fieldErrors: {
          email: 'This email is already registered.',
        },
      },
    });

    await expect(
      submitSignUp({
        acceptTerms: true,
        email: 'existing@gmail.com',
        password: '123456',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          email: 'This email is already registered.',
        },
        formError: 'Sign-up failed.',
      },
    });
  });
});
