import type { SidebarNavigationRenderLinkArgs } from '@ordero/ui';
import Link from 'next/link';

type SidebarLinkProps = SidebarNavigationRenderLinkArgs;

export const SidebarLink = ({
  ariaCurrent,
  children,
  className,
  href,
  rel,
  target,
}: SidebarLinkProps) => (
  <Link
    aria-current={ariaCurrent}
    className={className}
    href={href}
    rel={rel}
    target={target}
  >
    {children}
  </Link>
);
