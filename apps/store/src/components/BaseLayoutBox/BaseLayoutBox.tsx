import { cn } from '@ordero/ui';
import type { BaseLayoutBoxProps } from './types';

const baseLayoutBoxClassName = cn(
  'bg-background box-border mx-auto w-full max-w-full min-w-[var(--breakpoint-xs-token)] px-3 py-1',
  'min-[600px]:max-w-[var(--breakpoint-sm-token)] min-[600px]:px-4',
  'min-[900px]:max-w-[var(--breakpoint-md-token)] min-[900px]:px-5',
  'min-[1200px]:max-w-[var(--breakpoint-lg-token)] min-[1200px]:px-6',
  'min-[1536px]:max-w-[var(--breakpoint-xl-token)] min-[1536px]:px-7'
);

export const BaseLayoutBox = ({ children }: BaseLayoutBoxProps) => (
  <section className={baseLayoutBoxClassName}>{children}</section>
);
