import type { ReactElement } from 'react';
import { HeaderLeft } from './HeaderLeft';
import { HeaderRight } from './HeaderRight';
import type { HeaderProps } from './types';

type HeaderCompoundComponent = ((props: HeaderProps) => ReactElement) & {
  Left: typeof HeaderLeft;
  Right: typeof HeaderRight;
};

const HeaderRoot = ({ children, id }: HeaderProps) => (
  <header
    className="flex h-[var(--space-8)] items-center justify-between border-b border-border bg-background px-[var(--space-3)]"
    data-slot="header"
    id={id}
  >
    {children}
  </header>
);

export const Header = Object.assign(HeaderRoot, {
  Left: HeaderLeft,
  Right: HeaderRight,
}) as HeaderCompoundComponent;
