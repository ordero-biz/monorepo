import { validateSignInEmail, validateSignInPassword } from './validations';

describe('validateSignInEmail', () => {
  it('rejects an invalid email address', () => {
    expect(validateSignInEmail('invalid')).toBe('Enter a valid email address.');
  });

  it('accepts a valid email address', () => {
    expect(validateSignInEmail('admin@gmail.com')).toBeUndefined();
  });
});

describe('validateSignInPassword', () => {
  it('rejects a password shorter than six characters', () => {
    expect(validateSignInPassword('12345')).toBe(
      'Password must contain at least 6 characters.'
    );
  });

  it('accepts a password with at least six characters', () => {
    expect(validateSignInPassword('123456')).toBeUndefined();
  });
});
