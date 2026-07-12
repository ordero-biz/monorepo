import {
  signUpSchema,
  validateAcceptTerms,
  validateSignUpEmail,
  validateSignUpPassword,
} from './validations';

describe('sign-up validation', () => {
  it('accepts valid account details and accepted terms', () => {
    expect(validateSignUpEmail({ value: 'admin@gmail.com' })).toBeUndefined();
    expect(validateSignUpPassword({ value: '123456' })).toBeUndefined();
    expect(validateAcceptTerms({ value: true })).toBeUndefined();
    expect(
      signUpSchema.safeParse({
        acceptTerms: true,
        email: 'admin@gmail.com',
        password: '123456',
      }).success
    ).toBe(true);
  });

  it('returns field messages for invalid account details and terms', () => {
    expect(validateSignUpEmail({ value: 'invalid-email' })).toBe(
      'Enter a valid email address.'
    );
    expect(validateSignUpPassword({ value: '12345' })).toBe(
      'Password must contain at least 6 characters.'
    );
    expect(validateAcceptTerms({ value: false })).toBe(
      'You must accept the terms to continue.'
    );
  });
});
