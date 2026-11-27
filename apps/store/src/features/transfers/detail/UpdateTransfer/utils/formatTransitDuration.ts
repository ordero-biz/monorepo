const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const formatTransitDuration = (
  dispatchedAt: string | null | undefined,
  now: Date = new Date()
): string | null => {
  if (!dispatchedAt) {
    return null;
  }

  const dispatchedTime = new Date(dispatchedAt).getTime();
  const currentTime = now.getTime();

  if (Number.isNaN(dispatchedTime) || Number.isNaN(currentTime)) {
    return null;
  }

  const elapsedMs = Math.max(0, currentTime - dispatchedTime);

  if (elapsedMs < HOUR_IN_MS) {
    return '< 1h in transit';
  }

  if (elapsedMs < DAY_IN_MS) {
    const hours = Math.floor(elapsedMs / HOUR_IN_MS);
    return `${hours}h in transit`;
  }

  const days = Math.floor(elapsedMs / DAY_IN_MS);
  return days === 1 ? '1 day in transit' : `${days} days in transit`;
};
