# Temporary TODO: Browser-local date, time, and locale formatting

Deferred during the in-transit transfer detail redesign and tracked for a
dedicated localization task.

For now, `TransferDetailHeader` receives `referenceTime` from TanStack Query's
hydrated `dataUpdatedAt` so SSR and client hydration compute the same elapsed
duration, while `formatDate`, `formatDateTime`, and number formatting remain
UTC / `'en-US'`.

## Target behavior

- Format dates, date-times, relative durations, and numbers using the user's
  browser-local timezone and locale (`Intl.DateTimeFormat`,
  `Intl.RelativeTimeFormat`, `Intl.NumberFormat`).
- Avoid skeleton flashes or header/table layout shifts on initial load by using
  React's `suppressHydrationWarning` on the leaf `<time>` / `<span>` element
  that renders the localized string (Option A), rather than hiding values behind
  a `useEffect` skeleton.
- Keep relative duration calculations anchored to a deterministic
  `referenceTime` (such as `query.dataUpdatedAt`) so server and client measure
  from the same baseline while allowing the browser to localize the output.

## Implementation checklist

- [ ] Audit UTC date helpers (`formatDate`, `formatDateTime`), relative duration
  helpers (`formatTransitDuration`), and hardcoded `.toLocaleString('en-US')`
  calls across `apps/store` and `apps/platform`.
- [ ] Introduce a small reusable `<time dateTime={...} suppressHydrationWarning>`
  display wrapper (or formatting convention) so `suppressHydrationWarning` stays
  narrowly scoped to leaf text nodes rather than parent containers.
- [ ] Switch `formatDate` and `formatDateTime` to browser-local timezone/locale
  formatting (with optional locale/timeZone parameters for deterministic unit
  tests).
- [ ] Localize `formatTransitDuration` using `Intl.RelativeTimeFormat` (or the
  chosen i18n layer) while keeping `referenceTime` as the comparison baseline.
- [ ] Verify SSR + client hydration with no console hydration warnings on
  prefetched `HydrationBoundary` pages (including `TransferDetailPage`) under
  non-UTC browser timezones.
- [ ] Remove this TODO once the localization pattern is adopted and documented.

## Starting points

- [Date formatting helpers](../../apps/store/src/lib/utils/formatDate.ts)
- [Transit duration helper](../../apps/store/src/features/transfers/detail/UpdateTransfer/utils/formatTransitDuration.ts)
- [Transfer detail header](../../apps/store/src/features/transfers/detail/UpdateTransfer/TransferDetailHeader.tsx)
- [In-transit transfer detail](../../apps/store/src/features/transfers/detail/TransferInProgressDetail/TransferInProgressDetail.tsx)
