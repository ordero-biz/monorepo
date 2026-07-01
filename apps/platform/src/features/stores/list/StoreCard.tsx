import { Card, IconButton } from '@ordero/ui';
import type { Store } from '@/lib/server/types';

type StoreCardProps = {
  store: Store;
};

export const StoreCard = ({ store }: StoreCardProps) => {
  const { name, subDomain } = store;

  return (
    <Card.Root variant="filled">
      <div className="relative flex flex-col gap-[var(--spacing-2)] px-[var(--card-content-p)] pt-[var(--card-content-p)] pb-[var(--spacing-2)]">
        <div className="flex size-[48px] select-none items-center justify-center overflow-hidden rounded-[var(--avatar-rounded-radius)] bg-primary text-primary-foreground">
          <span className="text-sm font-bold leading-none">
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col items-start gap-[var(--spacing-1)]">
          <h3 className="text-[length:var(--subtitle1-size-desktop)] font-semibold leading-[var(--subtitle1-line-height-desktop)] text-[color:var(--text-primary)]">
            {name}
          </h3>

          <div className="mt-[var(--spacing-0-5)] flex items-center gap-[var(--spacing-0-5)]">
            <span
              className="size-[16px] rounded-[var(--radius-50)] border border-[var(--primary-dark)]"
              aria-hidden="true"
            />
            <span className="text-[length:var(--caption-size-desktop)] font-semibold leading-[var(--caption-line-height-desktop)] text-[color:var(--primary-dark)]">
              {subDomain}.ordero.biz
            </span>
          </div>
        </div>

        <div className="absolute right-[var(--spacing-1)] top-[var(--spacing-1)] p-[var(--spacing-1)]">
          <IconButton color="inherit" size="s" aria-label={`${name} options`}>
            <span aria-hidden="true">...</span>
          </IconButton>
        </div>
      </div>
    </Card.Root>
  );
};
