import { authEmailSchema, authPasswordSchema } from './validations';

describe('auth validation schemas', () => {
  it('accepts a valid email address and password', () => {
    expect(authEmailSchema.safeParse('admin@gmail.com').success).toBe(true);
    expect(authPasswordSchema.safeParse('123456').success).toBe(true);
  });

  it('returns the configured messages for invalid credentials', () => {
    expect(
      authEmailSchema.safeParse('invalid-email').error?.issues[0]?.message
    ).toBe('Enter a valid email address.');
    expect(
      authPasswordSchema.safeParse('12345').error?.issues[0]?.message
    ).toBe('Password must contain at least 6 characters.');
  });
});
