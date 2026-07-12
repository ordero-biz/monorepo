import { getErrorMessage } from './error';

describe('getErrorMessage', () => {
  it.each([
    ['a string error', 'Required', 'Required'],
    ['an Error instance', new Error('Invalid value'), 'Invalid value'],
    [
      'an object with a message',
      { message: 'Already exists' },
      'Already exists',
    ],
    [
      'an object without a string message',
      { message: 42 },
      'This field needs attention.',
    ],
    ['an unknown value', undefined, 'This field needs attention.'],
  ])('returns the message for %s', (_, error, message) => {
    expect(getErrorMessage(error)).toBe(message);
  });
});
