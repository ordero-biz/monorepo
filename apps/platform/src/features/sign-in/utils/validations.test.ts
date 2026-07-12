import {
  signInSchema,
  validateSignInEmail,
  validateSignInPassword,
} from './validations';

describe('sign-in validation', () => {
  it('accepts valid credentials', () => {
    expect(validateSignInEmail({ value: 'admin@gmail.com' })).toBeUndefined();
    expect(validateSignInPassword({ value: '123456' })).toBeUndefined();
    expect(
      signInSchema.safeParse({
        email: 'admin@gmail.com',
        password: '123456',
      }).success
    ).toBe(true);
  });

  it('returns field messages for invalid credentials', () => {
    expect(validateSignInEmail({ value: 'invalid-email' })).toBe(
      'Enter a valid email address.'
    );
    expect(validateSignInPassword({ value: '12345' })).toBe(
      'Password must contain at least 6 characters.'
    );
  });
});
