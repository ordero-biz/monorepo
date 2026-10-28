import { Typography } from '@ordero/ui';
import { formatMoney } from '@/lib/utils/formatMoney';
import type { WarehouseDetailInventoryValueProps } from './types';

export const WarehouseDetailInventoryValue = ({
  totalPrice,
}: WarehouseDetailInventoryValueProps) => (
  <section
    aria-label="Inventory value"
    className="flex min-w-0 flex-col justify-center gap-[var(--space-1)] rounded-[var(--card-radius)] border border-[var(--color-primary-20)] bg-[var(--color-primary-8)] p-[var(--card-content-p)]"
  >
    <dl className="flex flex-col gap-[var(--space-1)]">
      <dt>
        <Typography color="text-secondary" variant="body2">
          Inventory value
        </Typography>
      </dt>
      <dd className="flex flex-wrap items-baseline gap-x-[var(--space-1)]">
        <span className="min-w-0 break-words text-[length:var(--h2-size-mobile)] leading-[var(--h2-line-height-mobile)] font-[var(--h2-weight)] tabular-nums [font-family:var(--h2-family)] md:text-[length:var(--h2-size-desktop)] md:leading-[var(--h2-line-height-desktop)]">
          {formatMoney(totalPrice)}
        </span>
        <Typography variant="subtitle2">USD</Typography>
      </dd>
    </dl>
    <Typography color="text-secondary" variant="body2">
      At cost · All products in this warehouse
    </Typography>
  </section>
);
