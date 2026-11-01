import type {
  BreadcrumbItem,
  BreadcrumbsProps,
  BreadcrumbsRenderLink,
} from './types';

const defaultLinkRenderer: BreadcrumbsRenderLink = ({
  children,
  className,
  href,
}) => (
  <a className={className} href={href}>
    {children}
  </a>
);

const linkClassName =
  'rounded-[var(--radius-0-5-token)] text-[var(--text-secondary)] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50';

type BreadcrumbsItemProps = {
  item: BreadcrumbItem;
  isCurrent: boolean;
  renderLink: BreadcrumbsRenderLink;
  showSeparator: boolean;
};

type RenderBreadcrumbContentArgs = {
  item: BreadcrumbItem;
  isCurrent: boolean;
  renderLink: BreadcrumbsRenderLink;
};

const renderBreadcrumbContent = ({
  item,
  isCurrent,
  renderLink,
}: RenderBreadcrumbContentArgs) => {
  if (isCurrent) {
    return (
      <span aria-current="page" className="text-foreground">
        {item.label}
      </span>
    );
  }

  if (!item.href) {
    return <span className="text-[var(--text-secondary)]">{item.label}</span>;
  }

  return renderLink({
    children: item.label,
    className: linkClassName,
    href: item.href,
    item,
  });
};

const BreadcrumbsItem = ({
  item,
  isCurrent,
  renderLink,
  showSeparator,
}: BreadcrumbsItemProps) => {
  return (
    <li className="contents">
      {showSeparator ? (
        <span
          aria-hidden="true"
          className="size-[var(--space-0-5)] shrink-0 rounded-full bg-[var(--text-disabled)]"
        />
      ) : null}
      {renderBreadcrumbContent({ item, isCurrent, renderLink })}
    </li>
  );
};

export const Breadcrumbs = ({
  ariaLabel = 'Breadcrumb',
  items,
  ref,
  renderLink = defaultLinkRenderer,
}: BreadcrumbsProps) => (
  <nav aria-label={ariaLabel} ref={ref}>
    <ol className="flex flex-wrap items-center gap-x-[var(--space-1)] gap-y-[var(--space-0-5)] text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)]">
      {items.map((item, index) => (
        <BreadcrumbsItem
          isCurrent={index === items.length - 1}
          item={item}
          key={item.id}
          renderLink={renderLink}
          showSeparator={index > 0}
        />
      ))}
    </ol>
  </nav>
);
