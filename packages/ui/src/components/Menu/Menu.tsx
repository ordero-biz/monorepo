'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import type {
  MenuItemProps,
  MenuPortalProps,
  MenuPopupProps,
  MenuPositionerProps,
  MenuRootProps,
  MenuTriggerProps,
} from './types';

const popupClassName =
  'z-50 flex min-w-[var(--anchor-width)] flex-col gap-[var(--menu-list-spacing)] overflow-y-auto overscroll-contain rounded-[var(--radius)] border border-border bg-popover p-[var(--menu-list-p)] text-popover-foreground shadow-[var(--dropdown-x1)_var(--dropdown-y1)_var(--dropdown-blur1)_var(--dropdown-spread1)_var(--color-grey-16),var(--dropdown-x2)_var(--dropdown-y2)_var(--dropdown-blur2)_var(--dropdown-spread2)_var(--color-grey-20)] outline-none';

const itemClassName =
  'flex min-h-[calc(var(--body2-line-height-desktop)+var(--menu-item-py)+var(--menu-item-py))] w-full cursor-pointer items-center gap-[var(--menu-item-spacing)] rounded-[var(--menu-item-radius)] px-[var(--menu-item-px)] py-[var(--menu-item-py)] text-left text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-foreground outline-none transition-[background-color,color] hover:bg-muted data-[highlighted]:bg-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)] data-[disabled]:hover:bg-transparent';

const getPopupMaxHeight = (
  maxHeight: NonNullable<MenuPopupProps['maxHeight']>
) => (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight);

export const MenuRoot = ({
  children,
  defaultOpen,
  disabled,
  loopFocus,
  modal,
  onOpenChange,
  open,
}: MenuRootProps) => (
  <MenuPrimitive.Root
    defaultOpen={defaultOpen}
    disabled={disabled}
    loopFocus={loopFocus}
    modal={modal}
    onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    open={open}
  >
    {children}
  </MenuPrimitive.Root>
);

export const MenuTrigger = ({
  'aria-label': ariaLabel,
  appearance = 'button',
  children,
  color,
  disabled,
  endIcon,
  id,
  size,
  startIcon,
  title,
  variant = 'outlined',
}: MenuTriggerProps) => {
  const iconButtonColor = color === 'secondary' ? 'default' : color;
  const iconButtonSize = size ?? 'm';

  return (
    <MenuPrimitive.Trigger
      disabled={disabled}
      id={id}
      render={(props) =>
        appearance === 'iconButton' ? (
          <IconButton
            aria-controls={props['aria-controls']}
            aria-describedby={props['aria-describedby']}
            aria-expanded={props['aria-expanded']}
            aria-haspopup={props['aria-haspopup']}
            aria-label={ariaLabel ?? props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            color={iconButtonColor}
            disabled={props.disabled}
            id={id}
            onBlur={props.onBlur}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onKeyDown={props.onKeyDown}
            onMouseDown={props.onMouseDown}
            onPointerDown={props.onPointerDown}
            ref={props.ref}
            title={title}
            size={iconButtonSize}
          >
            {children}
          </IconButton>
        ) : (
          <Button
            aria-controls={props['aria-controls']}
            aria-describedby={props['aria-describedby']}
            aria-expanded={props['aria-expanded']}
            aria-haspopup={props['aria-haspopup']}
            aria-label={ariaLabel ?? props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            color={color}
            disabled={props.disabled}
            endIcon={endIcon}
            id={id}
            onBlur={props.onBlur}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onKeyDown={props.onKeyDown}
            onMouseDown={props.onMouseDown}
            onPointerDown={props.onPointerDown}
            ref={props.ref}
            size={size}
            startIcon={startIcon}
            title={title}
            variant={variant}
          >
            {children}
          </Button>
        )
      }
      title={title}
    >
      {null}
    </MenuPrimitive.Trigger>
  );
};

export const MenuPortal = ({ children }: MenuPortalProps) => (
  <MenuPrimitive.Portal>{children}</MenuPrimitive.Portal>
);

export const MenuPositioner = ({
  align = 'start',
  children,
  side = 'bottom',
  sideOffset = 4,
}: MenuPositionerProps) => (
  <MenuPrimitive.Positioner
    align={align}
    side={side}
    sideOffset={sideOffset}
  >
    {children}
  </MenuPrimitive.Positioner>
);

export const MenuPopup = ({
  children,
  id,
  maxHeight,
}: MenuPopupProps) => {
  const popupMaxHeight =
    maxHeight === undefined ? undefined : getPopupMaxHeight(maxHeight);

  return (
    <MenuPrimitive.Popup
      className={popupClassName}
      id={id}
      style={
        popupMaxHeight !== undefined
          ? {
              maxHeight: `min(var(--available-height), ${popupMaxHeight})`,
            }
          : undefined
      }
    >
      {children}
    </MenuPrimitive.Popup>
  );
};

export const MenuItem = ({
  children,
  closeOnClick,
  disabled,
  id,
  label,
  onClick,
}: MenuItemProps) => (
  <MenuPrimitive.Item
    className={itemClassName}
    closeOnClick={closeOnClick}
    disabled={disabled}
    id={id}
    label={label}
    onClick={onClick}
  >
    {children}
  </MenuPrimitive.Item>
);
