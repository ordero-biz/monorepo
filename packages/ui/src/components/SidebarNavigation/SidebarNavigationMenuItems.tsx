import { Accordion } from '@base-ui/react/accordion';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { Popover } from '@base-ui/react/popover';
import { Tooltip } from '@base-ui/react/tooltip';
import { ChevronDown } from 'lucide-react';
import { type ReactElement, useMemo, useState } from 'react';
import { cn } from '@/ui/lib/utils';
import {
  accordionPanelClassName,
  accordionPanelContentClassName,
  collapsedHiddenClassName,
  collapsedRemovedClassName,
  iconSlotClassName,
  itemLabelClassName,
  nestedItemClassName,
  nestedItemWrapperClassName,
  nestedListContainerClassName,
  popoverPopupClassName,
  popoverTitleClassName,
  tooltipPopupClassName,
} from './classNames';
import {
  SidebarNavigationScopeProvider,
  useSidebarNavigationScope,
} from './SidebarNavigationScopeProvider';
import type {
  SidebarNavigationCollapseItem,
  SidebarNavigationItem,
  SidebarNavigationRenderLink,
} from './types';
import { useSidebarNavigationExpansion } from './useSidebarNavigationExpansion';
import {
  getActiveItemIds,
  getExpandedItemIds,
  isItemBranchActive,
  toAccordionItemIds,
} from './utils';

type SidebarNavigationMenuItemsProps = {
  depth: number;
  groupKey?: string;
  items: SidebarNavigationItem[];
  labelPath?: string[];
  renderLink?: SidebarNavigationRenderLink;
  rootLabel: string;
};

const getItemClassName = ({
  active,
  depth,
  disabled,
}: {
  active: boolean;
  depth: number;
  disabled: boolean;
}) =>
  cn(
    'relative flex w-full min-w-0 items-center rounded-[var(--radius-1-token)] text-left outline-none transition-[background-color,color] focus-visible:ring-3 focus-visible:ring-ring/50',
    depth === 0
      ? 'min-h-[var(--nav-item-root-height)] px-[var(--space-1-5)] py-[var(--space-0-5)]'
      : 'h-[var(--nav-item-sub-height)] px-[var(--space-1-5)] py-[var(--space-0-5)]',
    depth > 0 ? nestedItemClassName : null,
    disabled
      ? 'cursor-not-allowed text-[var(--text-disabled)]'
      : 'cursor-pointer',
    active && depth === 0
      ? 'bg-[var(--color-primary-8)] text-swap-dark-light-primary hover:bg-[var(--color-primary-8)] hover:text-swap-dark-light-primary'
      : null,
    active && depth > 0
      ? 'bg-[var(--color-grey-8)] text-foreground hover:bg-[var(--color-grey-8)]'
      : null,
    !active && !disabled
      ? 'text-[var(--text-secondary)] hover:bg-[var(--color-grey-8)] hover:text-foreground'
      : null
  );

const defaultLinkRenderer: SidebarNavigationRenderLink = ({
  ariaCurrent,
  children,
  className,
  href,
  rel,
  target,
}) => (
  <a
    aria-current={ariaCurrent}
    className={className}
    href={href}
    rel={rel}
    target={target}
  >
    {children}
  </a>
);

const labelSegmenter =
  typeof Intl.Segmenter === 'function' ? new Intl.Segmenter() : undefined;

const getLabelInitial = (label: string) => {
  const trimmedLabel = label.trim();

  return (
    labelSegmenter?.segment(trimmedLabel).containing(0)?.segment ??
    trimmedLabel[Symbol.iterator]().next().value
  );
};

const SidebarNavigationItemContent = ({
  item,
  isOpen,
}: {
  item: SidebarNavigationItem;
  isOpen?: boolean;
}) => {
  const { renderCollapsed } = useSidebarNavigationScope();
  const branchActive = isItemBranchActive(item);
  const fallback =
    renderCollapsed && !item.icon ? getLabelInitial(item.label) : null;

  return (
    <>
      {item.icon ? (
        <span className={iconSlotClassName}>{item.icon}</span>
      ) : null}
      {fallback ? (
        <span
          aria-hidden="true"
          className={cn(
            iconSlotClassName,
            'font-[var(--nav-item-active-weight)] uppercase'
          )}
        >
          {fallback}
        </span>
      ) : null}
      <span
        className={cn(
          itemLabelClassName,
          collapsedHiddenClassName,
          branchActive
            ? 'font-[var(--nav-item-active-weight)]'
            : 'font-[var(--nav-item-weight)]'
        )}
      >
        {item.label}
      </span>
      {item.badge ? (
        <span
          className={cn(
            'ml-[var(--space-1)] shrink-0',
            collapsedRemovedClassName
          )}
        >
          {item.badge}
        </span>
      ) : null}
      {item.kind === 'collapse' ? (
        <span
          className={cn(
            'ml-[var(--space-1)] flex size-[var(--space-2)] shrink-0 items-center justify-center transition-transform duration-150 motion-reduce:transition-none',
            collapsedRemovedClassName,
            isOpen && 'rotate-180'
          )}
        >
          <ChevronDown />
        </span>
      ) : null}
    </>
  );
};

const SidebarNavigationLeafItem = ({
  depth,
  item,
  renderLink,
}: {
  depth: number;
  item: Exclude<SidebarNavigationItem, SidebarNavigationCollapseItem>;
  renderLink?: SidebarNavigationRenderLink;
}) => {
  const { onItemSelect } = useSidebarNavigationScope();
  const className = getItemClassName({
    active: Boolean(item.active),
    depth,
    disabled: Boolean(item.disabled),
  });
  const content = <SidebarNavigationItemContent item={item} />;

  if (item.kind === 'action') {
    return (
      <ButtonPrimitive
        className={className}
        data-slot="sidebar-navigation-action"
        disabled={item.disabled}
        onClick={(event) => {
          item.onSelect({ event, item });
          onItemSelect?.();
        }}
        type="button"
      >
        {content}
      </ButtonPrimitive>
    );
  }

  if (item.disabled) {
    return (
      <div
        aria-disabled="true"
        className={className}
        data-slot="sidebar-navigation-link"
      >
        {content}
      </div>
    );
  }

  const resolvedTarget = item.target ?? (item.external ? '_blank' : undefined);
  const resolvedRel =
    item.rel ??
    (resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined);
  const resolvedRenderer = item.renderLink ?? renderLink ?? defaultLinkRenderer;

  return resolvedRenderer({
    ariaCurrent: item.active ? 'page' : undefined,
    children: content,
    className,
    external: Boolean(item.external),
    href: item.href,
    item,
    rel: resolvedRel,
    target: resolvedTarget,
  });
};

// Clears the 16px rail padding past the item edge plus a 4px gap, so popups
// open beside the rail instead of over its border.
const COLLAPSED_POPUP_SIDE_OFFSET = 20;

const SidebarNavigationCollapsedTooltip = ({
  children,
  label,
}: {
  children: ReactElement;
  label: string;
}) => (
  <Tooltip.Root>
    <Tooltip.Trigger
      render={
        <div
          className="w-full"
          data-slot="sidebar-navigation-tooltip-trigger"
        />
      }
    >
      {children}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner side="right" sideOffset={COLLAPSED_POPUP_SIDE_OFFSET}>
        <Tooltip.Popup className={tooltipPopupClassName}>{label}</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);

const SidebarNavigationCollapsedBranch = ({
  groupKey,
  item,
  renderLink,
  rootLabel,
}: {
  groupKey: string;
  item: SidebarNavigationCollapseItem;
  renderLink?: SidebarNavigationRenderLink;
  rootLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const branchActive = isItemBranchActive(item);

  return (
    <Popover.Root onOpenChange={setOpen} open={open}>
      <Popover.Trigger
        aria-label={item.label}
        className={getItemClassName({
          active: branchActive,
          depth: 0,
          disabled: Boolean(item.disabled),
        })}
        data-slot="sidebar-navigation-collapsed-branch"
        disabled={item.disabled}
        title={item.icon ? undefined : item.label}
      >
        <SidebarNavigationItemContent item={item} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          align="start"
          side="right"
          sideOffset={COLLAPSED_POPUP_SIDE_OFFSET}
        >
          <Popover.Popup
            aria-label={`${item.label} submenu`}
            className={popoverPopupClassName}
          >
            <div aria-hidden="true" className={popoverTitleClassName}>
              {item.label}
            </div>
            <SidebarNavigationScopeProvider
              onItemSelect={() => setOpen(false)}
              renderCollapsed={false}
            >
              <SidebarNavigationMenuItems
                depth={0}
                groupKey={groupKey}
                items={item.items}
                labelPath={[item.label]}
                renderLink={renderLink}
                rootLabel={rootLabel}
              />
            </SidebarNavigationScopeProvider>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const SidebarNavigationMenuItems = ({
  depth,
  groupKey,
  items,
  labelPath = [],
  renderLink,
  rootLabel,
}: SidebarNavigationMenuItemsProps) => {
  const { renderCollapsed, onItemSelect } = useSidebarNavigationScope();
  const menuKey =
    groupKey ??
    `menu:${JSON.stringify([rootLabel, items.map(({ id }) => id)])}`;
  const { expandedItemIds, navigationStateKey } = useMemo(() => {
    const activeItemIds = getActiveItemIds(items);
    const expandedItemIds = getExpandedItemIds(items);

    return {
      expandedItemIds,
      navigationStateKey: `${JSON.stringify(activeItemIds)}:${JSON.stringify(expandedItemIds)}`,
    };
  }, [items]);
  const [openItemIds, setOpenItemIds] = useSidebarNavigationExpansion({
    defaultKey: navigationStateKey,
    defaultOpenIds: expandedItemIds,
    groupKey: menuKey,
  });
  const accordionLabel =
    labelPath.length > 0 ? `${rootLabel}: ${labelPath.join(' / ')}` : rootLabel;

  const content = (
    <Accordion.Root
      aria-label={accordionLabel}
      className="flex flex-col gap-[var(--space-0-5)]"
      onValueChange={(nextValue) =>
        setOpenItemIds(toAccordionItemIds(nextValue))
      }
      multiple
      render={({ role: _role, ...listProps }) => (
        <ul {...listProps} data-slot="sidebar-navigation-menu" />
      )}
      value={openItemIds}
    >
      {items.map((item) => {
        const branchActive = isItemBranchActive(item);
        const childGroupKey = `${menuKey}/${JSON.stringify(item.id)}`;

        if (depth === 0 && renderCollapsed) {
          return (
            <li data-slot="sidebar-navigation-menu-item" key={item.id}>
              {item.kind === 'collapse' ? (
                <SidebarNavigationCollapsedBranch
                  groupKey={childGroupKey}
                  item={item}
                  renderLink={renderLink}
                  rootLabel={rootLabel}
                />
              ) : (
                <SidebarNavigationCollapsedTooltip label={item.label}>
                  <SidebarNavigationLeafItem
                    depth={depth}
                    item={item}
                    renderLink={renderLink}
                  />
                </SidebarNavigationCollapsedTooltip>
              )}
            </li>
          );
        }

        if (item.kind !== 'collapse') {
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: The link handles keyboard activation and its click bubbles to this row.
            <li
              className={depth > 0 ? nestedItemWrapperClassName : undefined}
              data-slot="sidebar-navigation-menu-item"
              key={item.id}
              onClick={
                item.kind === 'link' && !item.disabled
                  ? onItemSelect
                  : undefined
              }
            >
              <SidebarNavigationLeafItem
                depth={depth}
                item={item}
                renderLink={renderLink}
              />
            </li>
          );
        }

        const rowClassName = getItemClassName({
          active: branchActive,
          depth,
          disabled: Boolean(item.disabled),
        });

        return (
          <Accordion.Item
            className="group/item flex flex-col gap-[var(--space-0-5)]"
            data-slot="sidebar-navigation-menu-item"
            disabled={item.disabled}
            key={item.id}
            render={(props) => (
              <li
                {...props}
                className={cn(
                  props.className,
                  depth > 0 ? nestedItemWrapperClassName : null
                )}
              />
            )}
            value={item.id}
          >
            <Accordion.Header className="m-0">
              <Accordion.Trigger
                className={cn(
                  rowClassName,
                  'sidebar-navigation-branch-trigger'
                )}
              >
                <SidebarNavigationItemContent
                  item={item}
                  isOpen={openItemIds.includes(item.id)}
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel
              aria-label={`${item.label} submenu`}
              className={accordionPanelClassName}
            >
              <div
                className={cn(
                  accordionPanelContentClassName,
                  'pt-[var(--space-0-5)]'
                )}
              >
                <SidebarNavigationMenuItems
                  depth={depth + 1}
                  groupKey={childGroupKey}
                  items={item.items}
                  labelPath={[...labelPath, item.label]}
                  renderLink={renderLink}
                  rootLabel={rootLabel}
                />
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );

  if (depth === 0) {
    return content;
  }

  return <div className={nestedListContainerClassName}>{content}</div>;
};
