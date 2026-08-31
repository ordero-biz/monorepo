import { Breadcrumbs } from '@ordero/ui';
import Link from 'next/link';
import type { StoreBreadcrumbsProps } from './types';

export const StoreBreadcrumbs = ({ items }: StoreBreadcrumbsProps) => (
  <Breadcrumbs
    items={items}
    renderLink={({ children, className, href }) => (
      <Link className={className} href={href}>
        {children}
      </Link>
    )}
  />
);
