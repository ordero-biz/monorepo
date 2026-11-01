import type { ReactNode, Ref } from 'react';

export type BreadcrumbItem = {
  href?: string;
  id: string;
  label: ReactNode;
};

export type BreadcrumbsRenderLinkArgs = {
  children: ReactNode;
  className: string;
  href: string;
  item: BreadcrumbItem;
};

export type BreadcrumbsRenderLink = (
  args: BreadcrumbsRenderLinkArgs
) => ReactNode;

export type BreadcrumbsProps = {
  ariaLabel?: string;
  items: BreadcrumbItem[];
  ref?: Ref<HTMLElement>;
  renderLink?: BreadcrumbsRenderLink;
};
