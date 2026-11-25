'use client';

import { Card } from '@/ui/components/Card';
import type { ContextualActionBarRootProps } from './types';

export const ContextualActionBarRoot = ({
  ariaLabel,
  children,
}: ContextualActionBarRootProps) => (
  <aside aria-label={ariaLabel} data-slot="contextual-action-bar">
    <Card.Root variant="filled">
      <Card.Content>
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          {children}
        </div>
      </Card.Content>
    </Card.Root>
  </aside>
);
