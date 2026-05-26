'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { buttonVariants } from '@/ui/components/Button';
import { cn } from '@/ui/lib/utils';
import {
  backdropClassName,
  contentClassName,
  contentScrollableBodyClassName,
  contentScrollableClassName,
  contentScrollableRootClassName,
  contentScrollableViewportClassName,
  descriptionClassName,
  footerClassName,
  popupClassName,
  popupFullScreenClassName,
  popupScrollableLayoutClassName,
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

export const DialogRoot = ({
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

export const DialogTrigger = ({
  children,
  disabled,
  id,
  title,
}: DialogTriggerProps) => (
  <DialogPrimitive.Trigger
    disabled={disabled}
    id={id}
    render={(props) => (
      <ButtonPrimitive
        {...props}
        className={cn(buttonVariants({ variant: 'outlined' }), props.className)}
        disabled={disabled}
        id={id}
        title={title}
      >
        {children}
      </ButtonPrimitive>
    )}
    title={title}
  >
    {null}
  </DialogPrimitive.Trigger>
);

export const DialogPortal = ({ children }: DialogPortalProps) => (
  <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>
);

export const DialogBackdrop = ({ id }: DialogBackdropProps) => (
  <DialogPrimitive.Backdrop className={backdropClassName} id={id} />
);

export const DialogViewport = ({ children }: DialogViewportProps) => (
  <DialogPrimitive.Viewport className={viewportClassName}>
    {children}
  </DialogPrimitive.Viewport>
);

export const DialogPopup = ({
  children,
  fullscreen = false,
  id,
  size = 'sm',
}: DialogPopupProps) => (
  <DialogPrimitive.Popup
    className={cn(
      popupClassName,
      popupScrollableLayoutClassName,
      fullscreen ? popupFullScreenClassName : popupWidthClassNames[size]
    )}
    id={id}
  >
    {children}
  </DialogPrimitive.Popup>
);

export const DialogContent = ({
  children,
  id,
  scrollable = false,
}: DialogContentProps) => (
  <section
    className={cn(
      contentClassName,
      scrollable ? contentScrollableClassName : null
    )}
    data-slot="dialog-content"
    id={id}
  >
    {scrollable ? (
      <ScrollArea.Root
        className={contentScrollableRootClassName}
        data-scrollable="true"
      >
        <ScrollArea.Viewport className={contentScrollableViewportClassName}>
          <ScrollArea.Content className={contentScrollableBodyClassName}>
            {children}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    ) : (
      children
    )}
  </section>
);

export const DialogHeader = ({ children }: DialogHeaderProps) => (
  <header>{children}</header>
);

export const DialogTitle = ({ children, id }: DialogTitleProps) => (
  <DialogPrimitive.Title className={titleClassName} id={id}>
    {children}
  </DialogPrimitive.Title>
);

export const DialogDescription = ({ children, id }: DialogDescriptionProps) => (
  <DialogPrimitive.Description className={descriptionClassName} id={id}>
    {children}
  </DialogPrimitive.Description>
);

export const DialogClose = ({
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
      <ButtonPrimitive
        {...props}
        className={cn(
          buttonVariants({ color, size, variant }),
          props.className
        )}
        disabled={disabled}
        id={id}
        title={title}
      >
        {children}
      </ButtonPrimitive>
    )}
    title={title}
  >
    {null}
  </DialogPrimitive.Close>
);

export const DialogFooter = ({
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
      <DialogClose
        color={closeButtonColor}
        disabled={closeDisabled}
        size={closeButtonSize}
        variant={closeButtonVariant}
      >
        {closeButtonLabel}
      </DialogClose>
    )}
  </footer>
);
