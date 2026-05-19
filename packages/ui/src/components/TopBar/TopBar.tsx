import type { TopBarProps } from './types';

export const TopBarRoot = ({ children, id }: TopBarProps) => (
  <header
    className="sticky top-0 z-10 flex h-[var(--space-9)] min-w-0 items-center gap-[var(--space-2)] border-b border-border bg-transparent px-[var(--space-3)] relative isolate before:pointer-events-none before:absolute before:top-0 before:left-0 before:z-[-1] before:h-full before:w-full before:visible before:content-[''] before:bg-[color:rgb(from_var(--background)_r_g_b_/_0.8)] before:opacity-100 before:backdrop-blur-[6px] before:transition-[opacity,visibility] before:duration-200 before:ease-[cubic-bezier(0.4,0,0.2,1)]"
    data-slot="top-bar"
    id={id}
  >
    {children}
  </header>
);
