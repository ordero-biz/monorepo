import type { ReactElement } from 'react';
import { TopBarLeft } from './TopBarLeft';
import { TopBarRight } from './TopBarRight';
import type { TopBarProps } from './types';

type TopBarCompoundComponent = ((props: TopBarProps) => ReactElement) & {
  Left: typeof TopBarLeft;
  Right: typeof TopBarRight;
};

const TopBarRoot = ({ children, id }: TopBarProps) => (
  <header
    className="sticky top-0 z-10 flex h-[var(--space-9)] min-w-0 items-center gap-[var(--space-2)] border-b border-border bg-background px-[var(--space-3)]"
    data-slot="top-bar"
    id={id}
  >
    {children}
  </header>
);

export const TopBar = Object.assign(TopBarRoot, {
  Left: TopBarLeft,
  Right: TopBarRight,
}) as TopBarCompoundComponent;
