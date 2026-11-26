import { formatTransitDuration } from './formatTransitDuration';

describe('formatTransitDuration', () => {
  it('returns null when dispatchedAt is missing or invalid', () => {
    const now = new Date('2026-11-26T12:00:00Z');

    expect(formatTransitDuration(null, now)).toBeNull();
    expect(formatTransitDuration(undefined, now)).toBeNull();
    expect(formatTransitDuration('not-a-date', now)).toBeNull();
  });

  it('formats durations under 1 hour as "< 1h in transit"', () => {
    expect(
      formatTransitDuration(
        '2026-11-26T11:30:00Z',
        new Date('2026-11-26T12:00:00Z')
      )
    ).toBe('< 1h in transit');

    expect(
      formatTransitDuration(
        '2026-11-26T12:00:00Z',
        new Date('2026-11-26T12:00:00Z')
      )
    ).toBe('< 1h in transit');
  });

  it('clamps minor negative clock skew to "< 1h in transit"', () => {
    expect(
      formatTransitDuration(
        '2026-11-26T12:02:00Z',
        new Date('2026-11-26T12:00:00Z')
      )
    ).toBe('< 1h in transit');
  });

  it('formats durations between 1 and 23 hours in hours on the same day', () => {
    expect(
      formatTransitDuration(
        '2026-11-26T11:00:00Z',
        new Date('2026-11-26T12:00:00Z')
      )
    ).toBe('1h in transit');

    expect(
      formatTransitDuration(
        '2026-11-26T04:15:00Z',
        new Date('2026-11-26T12:45:00Z')
      )
    ).toBe('8h in transit');
  });

  it('formats next-calendar-day durations under 24 hours in hours', () => {
    expect(
      formatTransitDuration(
        '2026-11-20T19:00:00Z',
        new Date('2026-11-21T09:30:00Z')
      )
    ).toBe('14h in transit');

    expect(
      formatTransitDuration(
        '2026-11-20T19:00:00Z',
        new Date('2026-11-21T18:59:59Z')
      )
    ).toBe('23h in transit');
  });

  it('formats 24 hours to under 48 hours as "1 day in transit"', () => {
    expect(
      formatTransitDuration(
        '2026-11-20T19:00:00Z',
        new Date('2026-11-21T19:00:00Z')
      )
    ).toBe('1 day in transit');

    expect(
      formatTransitDuration(
        '2026-11-20T19:00:00Z',
        new Date('2026-11-22T18:59:59Z')
      )
    ).toBe('1 day in transit');
  });

  it('formats 48 hours or more in plural days', () => {
    expect(
      formatTransitDuration(
        '2026-11-20T10:00:00Z',
        new Date('2026-11-26T15:00:00Z')
      )
    ).toBe('6 days in transit');
  });
});
