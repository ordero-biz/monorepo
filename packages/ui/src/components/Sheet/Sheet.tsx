'use client';

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { Button } from '@ordero/ui/components/Button';
import { cn } from '@ordero/ui/lib/utils';
import { XIcon } from 'lucide-react';
import type * as React from 'react';

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-[color:color-mix(in_oklab,var(--default-button)_12%,transparent)] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-[2px]',
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col gap-4 border border-border/70 bg-background bg-clip-padding text-sm text-foreground shadow-xl outline-none transition duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-2 data-[side=bottom]:bottom-2 data-[side=bottom]:h-auto data-[side=bottom]:rounded-[20px] data-[side=bottom]:data-ending-style:translate-y-8 data-[side=bottom]:data-starting-style:translate-y-8 data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:h-[calc(100svh-1rem)] data-[side=left]:w-[min(calc(100vw-1rem),420px)] data-[side=left]:rounded-[20px] data-[side=left]:data-ending-style:translate-x-8 data-[side=left]:data-starting-style:translate-x-8 data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:h-[calc(100svh-1rem)] data-[side=right]:w-[min(calc(100vw-1rem),420px)] data-[side=right]:rounded-[20px] data-[side=right]:data-ending-style:translate-x-8 data-[side=right]:data-starting-style:translate-x-8 data-[side=top]:inset-x-2 data-[side=top]:top-2 data-[side=top]:h-auto data-[side=top]:rounded-[20px] data-[side=top]:data-ending-style:translate-y-[-2rem] data-[side=top]:data-starting-style:translate-y-[-2rem]',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="surface"
                className="absolute top-4 right-4 border border-border/70 bg-background text-muted-foreground shadow-none hover:bg-[var(--default-button-soft-bg)] hover:text-foreground"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1 px-6 pt-6 pb-2', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 px-6 pt-2 pb-6', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'pr-12 text-lg font-semibold tracking-[-0.01em] text-foreground',
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
