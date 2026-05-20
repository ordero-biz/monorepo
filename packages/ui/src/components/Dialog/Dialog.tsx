'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type { ReactElement } from 'react';
import { Button } from '@/ui/components/Button';
import { cn } from '@/ui/lib/utils';
import {
  backdropClassName,
  contentClassName,
  contentScrollableClassName,
  descriptionClassName,
  footerClassName,
  popupClassName,
  popupFullScreenClassName,
  popupWidthClassNames,
  titleClassName,
  viewportClassName,
} from './classNames';
import type {
  DialogBackdropProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogPopupProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
  DialogViewportProps,
} from './types';

type DialogCompoundComponent = {
  Backdrop: (props: DialogBackdropProps) => ReactElement;
  Close: (props: DialogCloseProps) => ReactElement;
  Content: (props: DialogContentProps) => ReactElement;
  Description: (props: DialogDescriptionProps) => ReactElement;
  Footer: (props: DialogFooterProps) => ReactElement;
  Header: (props: DialogHeaderProps) => ReactElement;
  Popup: (props: DialogPopupProps) => ReactElement;
  Portal: (props: DialogPortalProps) => ReactElement;
  Root: (props: DialogRootProps) => ReactElement;
  Title: (props: DialogTitleProps) => ReactElement;
  Trigger: (props: DialogTriggerProps) => ReactElement;
  Viewport: (props: DialogViewportProps) => ReactElement;
};

const Root = ({
  children,
  defaultOpen,
  modal,
  onOpenChange,
  open,
}: DialogRootProps) => (
  <DialogPrimitive.Root
    defaultOpen={defaultOpen}
    modal={modal}
    onOpenChange={onOpenChange}
    open={open}
  >
    {children}
  </DialogPrimitive.Root>
);

const Trigger = ({ children, disabled, id, title }: DialogTriggerProps) => (
  <DialogPrimitive.Trigger
    disabled={disabled}
    id={id}
    render={(props) => (
      <Button
        aria-label={props['aria-label']}
        disabled={disabled}
        id={id}
        onBlur={props.onBlur}
        onClick={props.onClick}
        onFocus={props.onFocus}
        onKeyDown={props.onKeyDown}
        tabIndex={props.tabIndex}
        title={title}
        variant="outlined"
      >
        {children}
      </Button>
    )}
    title={title}
  >
    {null}
  </DialogPrimitive.Trigger>
);

const Portal = ({ children }: DialogPortalProps) => (
  <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>
);

const Backdrop = ({ id }: DialogBackdropProps) => (
  <DialogPrimitive.Backdrop className={backdropClassName} id={id} />
);

const Viewport = ({ children }: DialogViewportProps) => (
  <DialogPrimitive.Viewport className={viewportClassName}>
    {children}
  </DialogPrimitive.Viewport>
);

const Popup = ({
  children,
  fullscreen = false,
  id,
  size = 'sm',
}: DialogPopupProps) => (
  <DialogPrimitive.Popup
    className={cn(
      popupClassName,
      fullscreen ? popupFullScreenClassName : popupWidthClassNames[size]
    )}
    id={id}
  >
    {children}
  </DialogPrimitive.Popup>
);

const Content = ({ children, id, scrollable = false }: DialogContentProps) => (
  <section
    className={cn(
      contentClassName,
      scrollable ? contentScrollableClassName : null
    )}
    data-scrollable={scrollable ? 'true' : undefined}
    data-slot="dialog-content"
    id={id}
  >
    {children}
  </section>
);

const Header = ({ children }: DialogHeaderProps) => <header>{children}</header>;

const Title = ({ children, id }: DialogTitleProps) => (
  <DialogPrimitive.Title className={titleClassName} id={id}>
    {children}
  </DialogPrimitive.Title>
);

const Description = ({ children, id }: DialogDescriptionProps) => (
  <DialogPrimitive.Description className={descriptionClassName} id={id}>
    {children}
  </DialogPrimitive.Description>
);

const Close = ({
  children,
  color,
  disabled,
  id,
  size,
  title,
  variant = 'outlined',
}: DialogCloseProps) => (
  <DialogPrimitive.Close
    disabled={disabled}
    id={id}
    render={(props) => (
      <Button
        aria-label={props['aria-label']}
        color={color}
        disabled={disabled}
        id={id}
        onBlur={props.onBlur}
        onClick={props.onClick}
        onFocus={props.onFocus}
        onKeyDown={props.onKeyDown}
        size={size}
        tabIndex={props.tabIndex}
        title={title}
        variant={variant}
      >
        {children}
      </Button>
    )}
    title={title}
  >
    {null}
  </DialogPrimitive.Close>
);

const Footer = ({
  children,
  closeButtonColor,
  closeButtonLabel = 'Close',
  closeButtonSize,
  closeButtonVariant = 'outlined',
  closeDisabled,
  hideCloseButton = false,
}: DialogFooterProps) => (
  <footer className={footerClassName}>
    {children}
    {hideCloseButton ? null : (
      <Close
        color={closeButtonColor}
        disabled={closeDisabled}
        size={closeButtonSize}
        variant={closeButtonVariant}
      >
        {closeButtonLabel}
      </Close>
    )}
  </footer>
);

export const Dialog: DialogCompoundComponent = {
  Backdrop,
  Close,
  Content,
  Description,
  Footer,
  Header,
  Popup,
  Portal,
  Root,
  Title,
  Trigger,
  Viewport,
};
