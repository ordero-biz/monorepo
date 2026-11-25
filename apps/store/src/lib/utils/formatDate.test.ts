import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO date with a short UTC month name', () => {
    expect(formatDate('2026-07-01')).toBe('01 Jul 2026');
  });

  it('uses UTC date parts for date-time values', () => {
    expect(formatDate('2026-01-01T23:30:00-02:00')).toBe('02 Jan 2026');
  });

  it('returns the original value when it cannot be parsed as a date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
