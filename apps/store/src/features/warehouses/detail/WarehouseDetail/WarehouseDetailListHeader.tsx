import { Chip } from '@ordero/ui';
import type { WarehouseDetailListHeaderProps } from './types';

export const WarehouseDetailListHeader = ({
  title,
  total,
  actions,
}: WarehouseDetailListHeaderProps) => (
  <div className="flex w-full flex-wrap items-center justify-between gap-[var(--space-2)]">
    <div className="flex items-center gap-[var(--space-1)]">
      <h2 className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] [font-family:var(--subtitle1-family)]">
        {title}
      </h2>
      {total !== undefined ? (
        <Chip size="s" variant="soft">
          {total}
        </Chip>
      ) : null}
    </div>
    {actions}
  </div>
);
