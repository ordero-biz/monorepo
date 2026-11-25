import { Breadcrumbs } from '@ordero/ui';
import Link from 'next/link';
import type { AppBreadcrumbsProps } from './types';

export const AppBreadcrumbs = ({ items }: AppBreadcrumbsProps) => (
  <Breadcrumbs
    items={items}
    renderLink={({ children, className, href }) => (
      <Link className={className} href={href}>
        {children}
      </Link>
    )}
  />
);
